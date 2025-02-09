import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExportFile } from "../ui/export-file"

// ----------------------【新增辅助函数：删除文本中指定行范围】----------------------
function deleteRowRangeFromText(text: string, startRow: number, endRow: number): string {
  const lines = text.split("\n")
  // 边界处理
  if (startRow < 0) startRow = 0
  if (endRow >= lines.length) endRow = lines.length - 1
  if (startRow > endRow) return text
  // 删除从 startRow 到 endRow（含）的行
  lines.splice(startRow, endRow - startRow + 1)
  return lines.join("\n")
}
// ----------------------【新增辅助函数结束】----------------------

export function DeleteRowRange() {
  const [files, setFiles] = useState<File[]>([])
  // 原有状态（假设已存在，不做改动）
  const [rowStart, setRowStart] = useState("")
  const [rowEnd, setRowEnd] = useState("")
  // ----------------------【新增状态：存储删除行范围后的文件预览结果】----------------------
  const [deleteRowResults, setDeleteRowResults] = useState<{ fileName: string; content: string }[]>([])
  // ----------------------【新增状态结束】----------------------

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // 原有的处理逻辑保持不变，新增删除行范围处理逻辑追加在此处
  const handleDeleteRowRange = () => {
    console.log(`删除行范围：${rowStart} 到 ${rowEnd}`)
    const start = Number(rowStart)
    const end = Number(rowEnd)
    const promises = files.map((file: File) => {
      return new Promise<{ fileName: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const originalText = reader.result as string
            // ----------------------【新增调用辅助函数删除行范围】----------------------
            const newText = deleteRowRangeFromText(originalText, start, end)
            // ----------------------【新增调用辅助函数结束】----------------------
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
        setDeleteRowResults(results)
        console.log("删除行范围完成", results)
      })
      .catch(err => {
        console.error("删除行范围过程中出错", err)
      })
  }
  const [isOpen, setIsOpen] = useState(false)

  return (
    <FeatureLayout>
      <DropZone onFileSelect={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          <div style={{ margin: "1rem 0" }}>
            <Label>起始行 (从0开始)</Label>
            <Input
              type="number"
              value={rowStart}
              onChange={(e) => setRowStart(e.target.value)}
              placeholder="请输入起始行"
            />
          </div>
          <div style={{ margin: "1rem 0" }}>
            <Label>结束行</Label>
            <Input
              type="number"
              value={rowEnd}
              onChange={(e) => setRowEnd(e.target.value)}
              placeholder="请输入结束行"
            />
          </div>
          <Button onClick={handleDeleteRowRange}>删除行范围</Button>
          {deleteRowResults.length > 0 && (
            <>
              <Button className="ml-3" onClick={() => setIsOpen(!isOpen)}>导出文件</Button>
              <ExportFile files={deleteRowResults} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
            </>
          )}
          {/* ----------------------【新增预览展示：显示每个文件处理后的文本】---------------------- */}
          {deleteRowResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>删除行范围预览</h3>
              {deleteRowResults.map((result) => (
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
