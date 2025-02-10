import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportFile } from "../ui/export-file"

// ----------------------【新增辅助函数：执行数学运算】----------------------
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
    console.log(`执行数学运算，操作类型：${selectedOperation}`)
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
