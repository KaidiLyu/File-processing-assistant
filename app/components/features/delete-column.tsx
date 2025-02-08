import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* ----------------------【新增辅助函数：用于删除文本中指定列】---------------------- */
function deleteColumnFromText(text: string, colIndex: number): string {
  // 将文本按行拆分
  const lines = text.split("\n")
  // 对每一行进行处理：按连续空白字符拆分成单元格，删除指定索引的单元格后再重组行文本
  const processedLines = lines.map(line => {
    const columns = line.split(/\s+/)
    // 如果指定的列索引不在范围内，则保持原行不变
    if (colIndex < 0 || colIndex >= columns.length) {
      return line
    }
    // 删除指定的列
    columns.splice(colIndex, 1)
    // 使用单个空格重新拼接
    return columns.join(" ")
  })
  return processedLines.join("\n")
}
/* ----------------------【新增辅助函数结束】---------------------- */

export function DeleteColumn() {
  const [files, setFiles] = useState<File[]>([])
  const [columnIndex, setColumnIndex] = useState<string>("") // 原有状态，用于输入待删除的列索引
  
  // ----------------------【新增状态：用于存储删除列后文件的预览结果】----------------------
  const [deleteResults, setDeleteResults] = useState<Array<{ fileName: string; content: string }>>([])
  // ----------------------【新增状态结束】----------------------
  
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleDelete = () => {
    console.log(`删除列：${columnIndex}`)
    // ----------------------【新增删除列逻辑开始】----------------------
    const colIdx = Number(columnIndex)
    const promises = files.map((file: File) => {
      return new Promise<{ fileName: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const originalText = reader.result as string
            const newText = deleteColumnFromText(originalText, colIdx)
            resolve({ fileName: file.name, content: newText })
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
        setDeleteResults(results)
        console.log("删除列完成", results)
      })
      .catch(err => {
        console.error("删除列过程中出错", err)
      })
    // ----------------------【新增删除列逻辑结束】----------------------
  }

  return (
    <FeatureLayout>
      <DropZone onFiles={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          <div style={{ margin: "1rem 0" }}>
            <Label>要删除的列索引</Label>
            <Input
              type="number"
              value={columnIndex}
              onChange={(e) => setColumnIndex(e.target.value)}
              placeholder="请输入列索引，从0开始"
            />
          </div>
          <Button onClick={handleDelete}>删除列</Button>
          {/* ----------------------【新增预览展示：显示每个文件处理后的文本】---------------------- */}
          {deleteResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>删除列预览</h3>
              {deleteResults.map((result) => (
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
          {/* ----------------------【新增预览展示结束】---------------------- */}
        </>
      )}
    </FeatureLayout>
  )
}
