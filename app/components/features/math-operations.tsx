import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportFile } from "../ui/export-file"

// ----------------------【新增辅助函数：执行数学运算（全文件运算）】----------------------
function performMathOperation(text: string, operation: string): string {
  // 将文本按任意空白字符拆分成数组，并过滤掉空字符串
  const tokens = text.split(/\s+/).filter(token => token.trim() !== "")
  // 将所有能转换为数字的字符串转换为数字
  const numbers = tokens.map(token => parseFloat(token)).filter(num => !isNaN(num))
  if (numbers.length === 0) return "未找到有效数字。"
  let result: number
  switch (operation) {
    case "sum":
      result = numbers.reduce((a, b) => a + b, 0)
      break
    case "average":
      result = numbers.reduce((a, b) => a + b, 0) / numbers.length
      break
    case "max":
      result = Math.max(...numbers)
      break
    case "min":
      result = Math.min(...numbers)
      break
    default:
      result = 0
  }
  return result.toString()
}
// ----------------------【新增辅助函数结束】----------------------

// ----------------------【新增辅助函数：计算单行公式结果】----------------------
function evaluateFormulaForRow(columns: string[], formula: string): string {
  // 先将可能的中文格式转换为标准格式，例如“第2列”转换为“x2”，中文括号转换为英文括号
  let processedFormula = formula.replace(/第(\d+)列/g, 'x$1').replace(/[（]/g, '(').replace(/[）]/g, ')')
  // 将所有形如 x数字 的标记替换为对应列的数值（注意：用户输入的列号按 1 开始计数）
  const expr = processedFormula.replace(/x(\d+)/g, (match, p1) => {
    const colIndex = parseInt(p1, 10) - 1
    const value = parseFloat(columns[colIndex])
    return isNaN(value) ? "0" : value.toString()
  })
  try {
    const result = eval(expr)
    return result.toString()
  } catch (e) {
    return "Error"
  }
}
// ----------------------【新增辅助函数结束】----------------------

// ----------------------【新增辅助函数：对 CSV 文本执行列运算】----------------------
function performColumnMathOperation(text: string, formula: string): string {
  // 按行分割文本
  const lines = text.split("\n")
  if (lines.length === 0) return text
  // 假设 CSV 文件以逗号分隔，对于表头行在末尾追加新列名称，其余行追加计算结果
  const newLines = lines.map((line, index) => {
    const columns = line.split(",")
    if (index === 0) {
      // 表头行追加新列名称，标明运算公式
      return line + `,运算结果(${formula})`
    } else {
      const newValue = evaluateFormulaForRow(columns, formula)
      return line + `,${newValue}`
    }
  })
  return newLines.join("\n")
}
// ----------------------【新增辅助函数结束】----------------------

export function MathOperations() {
  // 原有代码：文件上传及列表管理（保持不变）
  const [files, setFiles] = useState<File[]>([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新增状态：选择的数学运算和结果预览】----------------------
  const [selectedOperation, setSelectedOperation] = useState("sum")
  const [mathResults, setMathResults] = useState<Array<{ fileName: string; result: string }>>([])
  // ----------------------【新增状态结束】----------------------

  // ----------------------【新增逻辑：执行数学运算】----------------------
  const handleMathOperation = () => {
    /* 新增提示：用户可选择执行全文件运算（基于空白符提取所有数字）或对 CSV 文件指定列进行运算
       其中：
         1 - 全文件运算（使用现有的 selectedOperation 值，如 sum、average、max、min）
         2 - 单列运算（例如对某一列进行 x2+3 运算，公式中 xN 表示第 N 列的值）
         3 - 列间运算（例如 (x2+x3)*2 运算，多列运算公式同样使用 xN 标记列号）
    */
    const opType = prompt(
      "请选择数学运算类型：\n1 - 全文件运算（求和、平均值、最大值、最小值）\n2 - 单列运算\n3 - 列间运算",
      "1"
    )
    if (!opType) return

    if (opType === "1") {
      // 全文件运算，使用现有 performMathOperation 函数和 selectedOperation
      console.log(`执行全文件数学运算，操作类型：${selectedOperation}`)
      const promises = files.map((file: File) => {
        return new Promise<{ fileName: string; result: string }>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            if (reader.result) {
              const text = reader.result as string
              const result = performMathOperation(text, selectedOperation)
              resolve({ fileName: file.name, result })
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
    } else if (opType === "2" || opType === "3") {
      // 对 CSV 文件执行列运算（单列或列间运算均使用同一处理逻辑）
      const formulaPrompt =
        opType === "2"
          ? "请输入单列运算公式，例如：x2+3，其中 x2 代表第2列的值"
          : "请输入列间运算公式，例如：(x2+x3)*2，其中 x2 代表第2列的值，x3 代表第3列的值"
      const formula = prompt(formulaPrompt)
      if (!formula) return
      console.log(`执行列运算，公式：${formula}`)
      const promises = files.map((file: File) => {
        return new Promise<{ fileName: string; result: string }>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            if (reader.result) {
              const text = reader.result as string
              const result = performColumnMathOperation(text, formula)
              resolve({ fileName: file.name, result })
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
    } else {
      alert("无效的选择。")
    }
  }
  // ----------------------【新增逻辑结束】----------------------

  return (
    <FeatureLayout>
      <DropZone onFileSelect={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          {/* ----------------------【新增数学运算输入项开始】---------------------- */}
          <div style={{ margin: "1rem 0" }}>
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
          {/* ----------------------【新增数学运算输入项结束】---------------------- */}
          <Button onClick={handleMathOperation}>执行数学运算</Button>
          {/* ----------------------【新增预览展示：显示数学运算结果】---------------------- */}
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
                    {result.result}
                  </pre>
                </div>
              ))}
            </div>
          )}
          {/* ----------------------【新增预览展示结束】---------------------- */}
        </>
      )}
    </FeatureLayout>
  )
}
