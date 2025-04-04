import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportFile } from "../ui/export-file"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ----------------------【新的辅助函数：解析公式】----------------------
function parseFormula(formula: string): (values: number[]) => number {
  try {
    // 替换A、B、C等列标识符为数组索引
    const columnMapping: Record<string, string> = {};
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((col, index) => {
      columnMapping[col] = `values[${index}]`;
    });
    
    let jsFormula = formula;
    for (const col in columnMapping) {
      // 确保只替换单独的字母，不替换字母可能作为其他标识符的一部分
      jsFormula = jsFormula.replace(new RegExp(`\\b${col}\\b`, 'g'), columnMapping[col]);
    }
    
    // 创建一个函数来执行计算
    return new Function('values', `return ${jsFormula}`) as (values: number[]) => number;
  } catch (error) {
    console.error("公式解析错误:", error);
    return () => NaN;
  }
}

// ----------------------【新的辅助函数：将字母列索引转换为数字索引】----------------------
function letterToIndex(letter: string): number {
  // 将A转为0，B转为1，以此类推
  return letter.toUpperCase().charCodeAt(0) - 65;
}

// ----------------------【新的辅助函数：解析字母列索引】----------------------
function parseLetterColumnIndices(input: string): number[] {
  try {
    // 去除所有空格，统一为大写处理
    const cleaned = input.replace(/\s+/g, '').toUpperCase();
    
    // 支持范围形式，如A-D
    if (cleaned.includes('-')) {
      const [start, end] = cleaned.split('-');
      if (start.length === 1 && end.length === 1) {
        const startIdx = letterToIndex(start);
        const endIdx = letterToIndex(end);
        return Array.from({ length: endIdx - startIdx + 1 }, (_, i) => startIdx + i);
      }
    }
    
    // 支持逗号分隔的单个字母，如A,C,F
    return cleaned.split(',')
      .filter(letter => letter.length === 1 && /[A-Z]/.test(letter))
      .map(letterToIndex);
  } catch (e) {
    console.error("解析字母列索引出错:", e);
    return [];
  }
}

// ----------------------【生成列标题的辅助函数】----------------------
function generateColumnTitle(
  columnIndices: number[],
  operation: string,
  customFormula: string = ""
): string {
  // 将数字索引转换为字母，便于显示
  const columnLetters = columnIndices.map(idx => String.fromCharCode(65 + idx));
  
  if (operation === "custom") {
    return customFormula; // 使用自定义公式作为列标题
  } else {
    // 使用列字母和操作类型生成标题
    const opSymbols: Record<string, string> = {
      "sum": "+",
      "average": "平均",
      "max": "最大",
      "min": "最小"
    };
    
    if (operation === "average") {
      return `(${columnLetters.join("+")})/\
${columnIndices.length}`;
    } else if (operation === "max") {
      return `${opSymbols[operation]}(${columnLetters.join(",")})`;
    } else if (operation === "min") {
      return `${opSymbols[operation]}(${columnLetters.join(",")})`;
    } else {
      return columnLetters.join(opSymbols[operation] || "_");
    }
  }
}

// ----------------------【新的辅助函数：按列执行数学运算】----------------------
function performColumnMathOperation(
  text: string, 
  columnIndices: number[], 
  operation: string, 
  formula: string = ""
): string {
  // 将文本按行拆分
  const lines = text.trim().split("\n");
  if (lines.length === 0) return "文件为空";

  // 生成结果列的标题
  const columnTitle = generateColumnTitle(columnIndices, operation, formula);
  
  // 结果行
  const resultLines: string[] = [];

  // 遍历每一行
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 如果是第一行，直接添加列名作为结果
    if (i === 0) {
      resultLines.push(`${line} ${columnTitle}`);
      continue;
    }
    
    // 处理数据行
    const columns = line.trim().split(/\s+/);
    
    // 提取指定列的数值
    const columnValues = columnIndices.map(colIdx => {
      if (colIdx >= 0 && colIdx < columns.length) {
        return parseFloat(columns[colIdx]);
      }
      return NaN;
    });

    // 计算结果
    let result = NaN;
    
    // 如果是自定义公式，计算结果
    if (operation === "custom") {
      try {
        const calculate = parseFormula(formula);
        result = calculate(columnValues);
      } catch (error) {
        console.error("计算错误:", error);
      }
    } else {
      // 预定义的操作
      const validValues = columnValues.filter(val => !isNaN(val));
      
      if (validValues.length > 0) {
  switch (operation) {
    case "sum":
            result = validValues.reduce((a, b) => a + b, 0);
            break;
    case "average":
            result = validValues.reduce((a, b) => a + b, 0) / validValues.length;
            break;
    case "max":
            result = Math.max(...validValues);
            break;
    case "min":
            result = Math.min(...validValues);
            break;
    default:
            result = NaN;
        }
      }
    }
    
    // 添加原始行和计算结果
    resultLines.push(`${line} ${isNaN(result) ? "NaN" : result.toFixed(4)}`);
  }

  return resultLines.join("\n");
}

export function MathOperations() {
  // 原有代码：文件上传及列表管理
  const [files, setFiles] = useState<File[]>([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
    setMathResults([])
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新的状态：操作类型、列索引和自定义公式】----------------------
  const [selectedOperation, setSelectedOperation] = useState("sum")
  const [columnIndices, setColumnIndices] = useState("")
  const [customFormula, setCustomFormula] = useState("")
  const [mathResults, setMathResults] = useState<Array<{ fileName: string; content: string }>>([])
  const [activeTab, setActiveTab] = useState("predefined")

  // ----------------------【新的函数：解析列索引字符串】----------------------
  const parseColumnIndices = (input: string): number[] => {
    return parseLetterColumnIndices(input);
  }

  // ----------------------【执行数学运算的新逻辑】----------------------
  const handleMathOperation = () => {
    if (files.length === 0) return;
    
    // 解析列索引
    const parsedIndices = parseColumnIndices(columnIndices);
    if (parsedIndices.length === 0) {
      alert("请输入有效的列索引");
      return;
    }

    // 对于自定义公式，验证公式是否存在
    if (activeTab === "custom" && !customFormula.trim()) {
      alert("请输入有效的计算公式");
      return;
    }

    const operation = activeTab === "custom" ? "custom" : selectedOperation;
    
    console.log(`执行列数学运算，操作类型：${operation}，列索引：${parsedIndices.join(',')}${
      operation === "custom" ? `，公式：${customFormula}` : ''
    }`);
    
    const promises = files.map((file: File) => {
      return new Promise<{ fileName: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const text = reader.result as string
            const result = performColumnMathOperation(
              text, 
              parsedIndices, 
              operation, 
              customFormula
            )
            resolve({ fileName: file.name, content: result })
          } else {
            reject(new Error("文件读取失败"))
          }
        }
        reader.onerror = () => reject(new Error("读取文件出错"))
        reader.readAsText(file)
      })
    })
    
    Promise.all(promises)
      .then(results => {
        setMathResults(results)
        console.log("数学运算完成", results)
      })
      .catch(err => {
        console.error("数学运算出错", err)
      })
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <FeatureLayout>
      <DropZone onFileSelect={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          
          <div className="space-y-4 my-4">
            <div>
              <Label>列索引（例如: A,B,C 或 A-D）</Label>
              <Input
                value={columnIndices}
                onChange={(e) => setColumnIndices(e.target.value)}
                placeholder="输入列索引，多列用逗号分隔"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                例如: 输入"A,C"表示第一列和第三列，A=第一列，B=第二列，以此类推
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="predefined">预定义运算</TabsTrigger>
                <TabsTrigger value="custom">自定义公式</TabsTrigger>
              </TabsList>
              
              <TabsContent value="predefined">
                <div className="space-y-2">
            <Label>选择运算</Label>
            <Select value={selectedOperation} onValueChange={(value: string) => setSelectedOperation(value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择运算" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sum">求和</SelectItem>
                <SelectItem value="average">平均值</SelectItem>
                <SelectItem value="max">最大值</SelectItem>
                <SelectItem value="min">最小值</SelectItem>
              </SelectContent>
            </Select>
          </div>
              </TabsContent>
              
              <TabsContent value="custom">
                <div className="space-y-2">
                  <Label>自定义公式</Label>
                  <Input
                    value={customFormula}
                    onChange={(e) => setCustomFormula(e.target.value)}
                    placeholder="例如: A+B/2 或 (A+C)*2-3"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    使用A、B、C...表示列，可以使用数字常量和数学运算符，例如: A+B-2 或 (A+C)*3/2
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
          <Button onClick={handleMathOperation}>执行数学运算</Button>
            
            {mathResults.length > 0 && (
              <>
                <Button className="ml-3" onClick={() => setIsOpen(!isOpen)}>导出文件</Button>
                <ExportFile files={mathResults} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
              </>
            )}
            
          {mathResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>数学运算结果预览</h3>
              {mathResults.map((result) => (
                <div key={result.fileName} style={{ marginBottom: "1rem" }}>
                  <h4>{result.fileName}</h4>
                  <pre
                    style={{
                      background: "#f5f5f5",
                      padding: "1rem",
                      borderRadius: "4px",
                      overflowX: "auto"
                    }}
                  >
                      {result.content}
                  </pre>
                </div>
              ))}
            </div>
          )}
          </div>
        </>
      )}
    </FeatureLayout>
  )
}
