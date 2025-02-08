import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ----------------------【新增辅助函数：删除文本中指定行集合】----------------------
function deleteSpecificRowsFromText(text: string, rowIndices: number[]): string {
  const lines = text.split("\n")
  // 过滤掉行索引在 rowIndices 中的行（注意：索引基于0）
  const filteredLines = lines.filter((line, index) => !rowIndices.includes(index))
  return filteredLines.join("\n")
}
// ----------------------【新增辅助函数结束】----------------------

export function DeleteSpecificRow() {
  const [files, setFiles] = useState([])
  // 原有状态保持不变，增加用于输入要删除的行索引（多个索引以逗号分隔）
  const [specificRows, setSpecificRows] = useState("")
  // ----------------------【新增状态：存储删除指定行后的文件预览结果】----------------------
  const [deleteSpecificResults, setDeleteSpecificResults] = useState([])
  // ----------------------【新增状态结束】----------------------
  
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }
  
  // ----------------------【新增删除指定行逻辑开始】----------------------
  const handleDeleteSpecificRow = () => {
    console.log(`删除指定行: ${specificRows}`)
    // 将输入的 specificRows 按逗号分隔，并转换为数字数组（去除空白并过滤非数字）
    const rowIndices = specificRows
      .split(",")
      .map(str => Number(str.trim()))
      .filter(num => !isNaN(num))
  
    const promises = files.map((file: File) => {
      return new Promise<{ fileName: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const originalText = reader.result as string
            const newText = deleteSpecificRowsFromText(originalText, rowIndices)
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
        setDeleteSpecificResults(results)
        console.log("删除指定行完成", results)
      })
      .catch(err => {
        console.error("删除指定行过程中出错", err)
      })
  }
  // ----------------------【新增删除指定行逻辑结束】----------------------
  
  return (
    <FeatureLayout>
      <DropZone onFiles={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          <div style={{ margin: "1rem 0" }}>
            <Label>删除的行索引 (多个请用逗号分隔，例如 "1,3,5")</Label>
            <Input
              type="text"
              value={specificRows}
              onChange={(e) => setSpecificRows(e.target.value)}
              placeholder="请输入要删除的行索引"
            />
          </div>
          <Button onClick={handleDeleteSpecificRow}>删除指定行</Button>
          {/* ----------------------【新增预览展示：显示每个文件处理后的文本】---------------------- */}
          {deleteSpecificResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>删除指定行预览</h3>
              {deleteSpecificResults.map((result) => (
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
