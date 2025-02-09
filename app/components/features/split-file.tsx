import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input" // 【新增代码】
import { ExportFile } from "../ui/export-file"

// ----------------------【新增辅助函数：按固定行数拆分文件内容】----------------------
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

// ----------------------【新增辅助函数：按第一列拆分文件内容】----------------------
function splitFileByFirstColumn(text: string, delimiter: string = ","): string[] {
  // 按第一列的值分组，每个不同的第一列值作为一个分组，返回各分组的文本
  const lines = text.split("\n").filter(line => line.trim() !== "")
  const groups: Record<string, string[]> = {}
  lines.forEach(line => {
    const columns = line.split(delimiter)
    const key = columns[0].trim()
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(line)
  })
  return Object.keys(groups).map(key => groups[key].join("\n"))
}
// ----------------------【新增辅助函数结束】----------------------

// ----------------------【新增辅助函数：按列拆分文件内容】----------------------
function splitFileByColumns(text: string, leftColumnsCount: number, delimiter: string = ","): string[] {
  // 将每一行按 delimiter 分割，然后把前 leftColumnsCount 列与剩余列分别拼接成两段文本
  const lines = text.split("\n").filter(line => line.trim() !== "")
  const leftParts: string[] = []
  const rightParts: string[] = []
  lines.forEach(line => {
    const columns = line.split(delimiter)
    const leftPart = columns.slice(0, leftColumnsCount).join(delimiter)
    const rightPart = columns.slice(leftColumnsCount).join(delimiter)
    leftParts.push(leftPart)
    rightParts.push(rightPart)
  })
  return [leftParts.join("\n"), rightParts.join("\n")]
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

  // ----------------------【新增状态：记录用户输入的拆分参数】----------------------
  // 此参数含义如下：
  // 正数 —— 按固定行数拆分（原有功能）
  // 0 —— 按第一列拆分（功能1）
  // 负数 —— 按列拆分，绝对值表示前几列数量（功能2）
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
            const splitParam = Number(linesPerSplit)
            if (isNaN(splitParam)) {
              reject(new Error("无效的拆分参数"))
              return
            }
            let parts: string[] = []
            if (splitParam > 0) {
              // 正数：按固定行数拆分（原有功能）
              parts = splitFileContent(text, splitParam)
            } else if (splitParam === 0) {
              // 0：按第一列拆分（功能1）
              parts = splitFileByFirstColumn(text)
            } else {
              // 负数：按列拆分（功能2），绝对值为前几列数量
              const leftColumnsCount = Math.abs(splitParam)
              parts = splitFileByColumns(text, leftColumnsCount)
            }
            resolve({
              fileName: file.name,
              parts
            })
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <FeatureLayout>
      <DropZone onFileSelect={handleFiles} />
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
          {splitResults.length > 0 && (
            <>
              <Button className="ml-3" onClick={() => setIsOpen(!isOpen)}>导出文件</Button>
              <ExportFile
                files={splitResults.flatMap((result, fileIndex) =>
                  result.parts.map((content, partIndex) => ({
                    fileName: `${result.fileName.replace(/\.[^/.]+$/, '')}_part${partIndex + 1}.txt`,
                    content: content
                  }))
                )}
                isOpen={isOpen}
                onClose={() => setIsOpen(!isOpen)}
              />
            </>
          )}
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
