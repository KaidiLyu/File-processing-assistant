import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExportFile } from "../ui/export-file"

// ----------------------【新增辅助函数：对 CSV 数据进行分组与聚合】----------------------
function groupAndAggregateData(text: string, groupCol: number, aggCol: number): string {
  // 假设CSV数据以换行符分隔，每行以逗号分隔各字段
  const lines = text.split("\n").filter(line => line.trim() !== "")
  if (lines.length === 0) return ""

  // 以对象存储每个分组的聚合值（默认聚合函数为求和）
  const groups: { [key: string]: number } = {}

  lines.forEach(line => {
    const cells = line.split(",")
    // 边界检查：确保分组列和聚合列存在
    if (cells.length > groupCol && cells.length > aggCol) {
      const key = cells[groupCol].trim()
      const value = parseFloat(cells[aggCol])
      if (!isNaN(value)) {
        groups[key] = (groups[key] || 0) + value
      }
    }
  })

  // 生成结果文本，每行格式：分组值,聚合结果
  let result = "Group,Sum\n"
  for (const key in groups) {
    result += `${key},${groups[key]}\n`
  }
  return result
}
// ----------------------【新增辅助函数结束】----------------------

export function GroupAndAggregate() {
  const [files, setFiles] = useState<File[]>([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新增状态：记录分组列和聚合列索引】----------------------
  const [groupColumn, setGroupColumn] = useState("")
  const [aggregateColumn, setAggregateColumn] = useState("")
  // ----------------------【新增状态：存储分组与聚合后的预览结果】----------------------
  const [aggregationResults, setAggregationResults] = useState<{ fileName: string; content: string }[]>([])
  // ----------------------【新增状态结束】----------------------

  const handleGroupAggregate = () => {
    console.log(`分组列索引：${groupColumn}，聚合列索引：${aggregateColumn}`)
    const groupColIndex = Number(groupColumn)
    const aggColIndex = Number(aggregateColumn)
    const promises = files.map((file: File, index: number) => {
      return new Promise<{ fileName: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const text = reader.result as string
            // ----------------------【新增调用辅助函数进行分组与聚合】----------------------
            const result = groupAndAggregateData(text, groupColIndex, aggColIndex)
            resolve({ fileName: file.name, content: result })
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
        setAggregationResults(results)
        console.log("分组与聚合完成", results)
      })
      .catch(err => {
        console.error("分组与聚合过程中出错", err)
      })
  }
  const [isOpen, setIsOpen] = useState(false)

  return (
    <FeatureLayout>
      <DropZone onFileSelect={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          {/* ----------------------【新增分组与聚合输入项开始】---------------------- */}
          <div style={{ margin: "1rem 0" }}>
            <Label>分组列索引 (从0开始)</Label>
            <Input
              type="number"
              value={groupColumn}
              onChange={(e) => setGroupColumn(e.target.value)}
              placeholder="请输入分组列索引"
            />
          </div>
          <div style={{ margin: "1rem 0" }}>
            <Label>聚合列索引 (从0开始)</Label>
            <Input
              type="number"
              value={aggregateColumn}
              onChange={(e) => setAggregateColumn(e.target.value)}
              placeholder="请输入聚合列索引"
            />
          </div>
          {/* ----------------------【新增分组与聚合输入项结束】---------------------- */}
          <Button onClick={handleGroupAggregate}>分组与聚合</Button>
          {aggregationResults.length > 0 && (
            <>
              <Button className="ml-3" onClick={() => setIsOpen(!isOpen)}>导出文件</Button>
              <ExportFile files={aggregationResults} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
            </>
          )}
          {/* ----------------------【新增分组与聚合预览展示开始】---------------------- */}
          {aggregationResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>分组与聚合预览</h3>
              {aggregationResults.map((result) => (
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
          {/* ----------------------【新增分组与聚合预览展示结束】---------------------- */}
        </>
      )}
    </FeatureLayout>
  )
}
