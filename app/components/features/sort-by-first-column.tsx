import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"
import { ExportFile } from "../ui/export-file"

// ----------------------【新增辅助函数：按第一列排序】----------------------
function sortByFirstColumn(text: string): string {
  // 将文本按换行符拆分为数组
  const lines = text.split("\n")
  // 过滤掉只包含空白字符的行
  const nonEmptyLines = lines.filter(line => line.trim() !== "")
  // 假设每行数据的各列以空白字符分隔，取第一列进行排序
  nonEmptyLines.sort((a, b) => {
    const aFirst = a.trim().split(/\s+/)[0] || ""
    const bFirst = b.trim().split(/\s+/)[0] || ""
    return aFirst.localeCompare(bFirst)
  })
  return nonEmptyLines.join("\n")
}
// ----------------------【新增辅助函数结束】----------------------

export function SortByFirstColumn() {
  const [files, setFiles] = useState<File[]>([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新增状态：存储排序后的预览结果】----------------------
  const [sortedResults, setSortedResults] = useState<Array<{ fileName: string; content: string }>>([])
  // ----------------------【新增状态结束】----------------------

  // ----------------------【新增逻辑：执行按第一列排序】----------------------
  const handleSort = () => {
    console.log("开始按第一列排序")
    const promises = files.map((file: File) => {
      return new Promise<{ fileName: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const originalText = reader.result as string
            // 调用辅助函数进行排序
            const sortedText = sortByFirstColumn(originalText)
            resolve({ fileName: file.name, content: sortedText })
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
        setSortedResults(results)
        console.log("排序完成", results)
      })
      .catch(err => {
        console.error("排序过程中出错", err)
      })
  }
  // ----------------------【新增逻辑结束】----------------------
  const [isOpen, setIsOpen] = useState(false)

  return (
    <FeatureLayout>
      <DropZone onFileSelect={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          <Button onClick={handleSort}>按第一列排序</Button>
          {sortedResults.length > 0 && (
            <>
              <Button className="ml-3" onClick={() => setIsOpen(!isOpen)}>导出文件</Button>
              <ExportFile files={sortedResults} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
            </>
          )}
          {/* ----------------------【新增预览展示：显示排序后的结果】---------------------- */}
          {sortedResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>排序预览</h3>
              {sortedResults.map(result => (
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
