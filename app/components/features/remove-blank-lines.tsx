import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"

// ----------------------【新增辅助函数：删除空行】----------------------
function removeBlankLinesFromText(text: string): string {
  // 将文本按换行符拆分成数组
  const lines = text.split("\n")
  // 过滤掉只包含空白字符的行
  const nonBlankLines = lines.filter(line => line.trim() !== "")
  return nonBlankLines.join("\n")
}
// ----------------------【新增辅助函数结束】----------------------

export function RemoveBlankLines() {
  const [files, setFiles] = useState<File[]>([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新增状态：存储删除空行后的预览结果】----------------------
  const [removeBlankResults, setRemoveBlankResults] = useState<Array<{ fileName: string; content: string }>>([])
  // ----------------------【新增状态结束】----------------------

  const handleRemoveBlankLines = () => {
    console.log("开始删除空行")
    const promises = files.map((file: File) => {
      return new Promise<{ fileName: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const originalText = reader.result as string
            // ----------------------【新增调用辅助函数删除空行】----------------------
            const newText = removeBlankLinesFromText(originalText)
            resolve({ fileName: file.name, content: newText })
            // ----------------------【新增调用辅助函数结束】----------------------
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
        setRemoveBlankResults(results)
        console.log("删除空行完成", results)
      })
      .catch(err => {
        console.error("删除空行过程中出错", err)
      })
  }

  return (
    <FeatureLayout>
      <DropZone onFiles={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          <Button onClick={handleRemoveBlankLines}>删除空行</Button>
          {/* ----------------------【新增预览展示：显示删除空行后的文本】---------------------- */}
          {removeBlankResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>删除空行预览</h3>
              {removeBlankResults.map(result => (
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
