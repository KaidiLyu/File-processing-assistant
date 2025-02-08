import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ----------------------【新增辅助函数：用于过滤文本中包含关键词的行】----------------------
function filterTextData(text: string, keyword: string): string {
  // 将文本按换行符拆分成数组
  const lines = text.split("\n")
  // 过滤出包含关键词的行，如果关键词为空则返回原文本
  const filteredLines = keyword
    ? lines.filter(line => line.includes(keyword))
    : lines
  return filteredLines.join("\n")
}
// ----------------------【新增辅助函数结束】----------------------

export function FilterData() {
  // 原有代码状态保持不变
  const [files, setFiles] = useState([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新增状态：用于记录过滤关键词】----------------------
  const [filterKeyword, setFilterKeyword] = useState("")
  // ----------------------【新增状态：用于存储过滤后的预览结果】----------------------
  const [filterResults, setFilterResults] = useState([])
  // ----------------------【新增状态结束】----------------------

  // ----------------------【新增过滤数据逻辑开始】----------------------
  const handleFilter = () => {
    console.log(`过滤数据，关键词：${filterKeyword}`)
    const promises = files.map((file: File) => {
      return new Promise<{ fileName: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const originalText = reader.result as string
            const filteredText = filterTextData(originalText, filterKeyword)
            resolve({ fileName: file.name, content: filteredText })
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
        setFilterResults(results)
        console.log("过滤数据完成", results)
      })
      .catch(err => {
        console.error("过滤数据过程中出错", err)
      })
  }
  // ----------------------【新增过滤数据逻辑结束】----------------------

  return (
    <FeatureLayout>
      <DropZone onFiles={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          {/* ----------------------【新增过滤数据输入项开始】---------------------- */}
          <div style={{ margin: "1rem 0" }}>
            <Label>过滤关键词</Label>
            <Input
              type="text"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              placeholder="请输入过滤关键词"
            />
          </div>
          {/* ----------------------【新增过滤数据输入项结束】---------------------- */}
          <Button onClick={handleFilter}>过滤数据</Button>
          {/* ----------------------【新增过滤数据预览展示开始】---------------------- */}
          {filterResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>过滤数据预览</h3>
              {filterResults.map((result) => (
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
          {/* ----------------------【新增过滤数据预览展示结束】---------------------- */}
        </>
      )}
    </FeatureLayout>
  )
}
