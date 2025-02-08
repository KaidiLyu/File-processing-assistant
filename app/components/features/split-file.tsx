import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input" // 【新增代码】

// ----------------------【新增辅助函数：分割文件内容】----------------------
function splitFileContent(text: string, linesPerSplit: number): string[] {
  // 将文本按换行符拆分成数组
  const lines = text.split("\n")
  const parts: string[] = []
  // 按每块行数循环分割
  for (let i = 0; i < lines.length; i += linesPerSplit) {
    parts.push(lines.slice(i, i + linesPerSplit).join("\n"))
  }
  return parts
}
// ----------------------【新增辅助函数结束】----------------------

export function SplitFile() {
  const [files, setFiles] = useState<File[]>([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新增状态：存储每个文件分割后的结果】----------------------
  const [splitResults, setSplitResults] = useState<Array<{ fileName: string; parts: string[] }>>([])
  // ----------------------【新增状态结束】----------------------

  // ----------------------【新增状态：记录用户输入的每个分割块包含的行数】----------------------
  const [linesPerSplit, setLinesPerSplit] = useState<string>("10")
  // ----------------------【新增状态结束】----------------------

  const handleSplit = () => {
    console.log("开始分割文件")
    const promises = files.map((file: File) => {
      return new Promise<{ fileName: string; parts: string[] }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const text = reader.result as string
            const linesNum = Number(linesPerSplit)
            if (isNaN(linesNum) || linesNum <= 0) {
              reject(new Error("无效的每块行数"))
              return
            }
            // ----------------------【新增调用辅助函数进行文件分割】----------------------
            const parts = splitFileContent(text, linesNum)
            resolve({ fileName: file.name, parts })
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
        setSplitResults(results)
        console.log("分割完成", results)
      })
      .catch(err => {
        console.error("分割过程中出错", err)
      })
  }

  return (
    <FeatureLayout>
      <DropZone onFiles={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          {/* ----------------------【新增输入项：设置每个分割块包含的行数】---------------------- */}
          <div style={{ margin: "1rem 0" }}>
            <Label>每个分割块包含的行数</Label>
            <Input
              type="number"
              value={linesPerSplit}
              onChange={(e) => setLinesPerSplit(e.target.value)}
              placeholder="请输入每个块的行数"
            />
          </div>
          {/* ----------------------【新增输入项结束】---------------------- */}
          <Button onClick={handleSplit}>分割文件</Button>
          {/* ----------------------【新增预览展示：显示分割后的结果】---------------------- */}
          {splitResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>分割结果预览</h3>
              {splitResults.map(result => (
                <div key={result.fileName} style={{ marginBottom: "1rem" }}>
                  <h4>{result.fileName}</h4>
                  {result.parts.map((part, index) => (
                    <div key={index} style={{ marginBottom: "0.5rem" }}>
                      <strong>部分 {index + 1}:</strong>
                      <pre
                        style={{
                          background: "#f5f5f5",
                          padding: "0.5rem",
                          borderRadius: "4px",
                          overflowX: "auto"
                        }}
                      >
                        {part}
                      </pre>
                    </div>
                  ))}
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
