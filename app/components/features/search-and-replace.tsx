import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Input } from "@/components/ui/input" // 【新增代码】
import { Label } from "@/components/ui/label" // 【新增代码】

// ----------------------【新增辅助函数：搜索替换】----------------------
function searchAndReplace(text: string, searchTerm: string, replaceTerm: string): string {
  if (!searchTerm) return text
  // 对搜索字符串中的特殊字符进行转义，避免正则报错
  const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(escapedSearchTerm, "g")
  return text.replace(regex, replaceTerm)
}
// ----------------------【新增辅助函数结束】----------------------

export function SearchAndReplace() {
  const [files, setFiles] = useState<File[]>([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新增状态：搜索与替换内容】----------------------
  const [searchTerm, setSearchTerm] = useState("")
  const [replaceTerm, setReplaceTerm] = useState("")
  // ----------------------【新增状态：存储搜索替换后的预览结果】----------------------
  const [replaceResults, setReplaceResults] = useState<Array<{ fileName: string; content: string }>>([])
  // ----------------------【新增状态结束】----------------------

  // ----------------------【新增逻辑：执行搜索替换】----------------------
  const handleSearchAndReplace = () => {
    console.log(`搜索内容：${searchTerm}，替换为：${replaceTerm}`)
    const promises = files.map((file: File) => {
      return new Promise<{ fileName: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const originalText = reader.result as string
            const newText = searchAndReplace(originalText, searchTerm, replaceTerm)
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
        setReplaceResults(results)
        console.log("搜索替换完成", results)
      })
      .catch(err => {
        console.error("搜索替换过程中出错", err)
      })
  }
  // ----------------------【新增逻辑结束】----------------------

  return (
    <FeatureLayout>
      <DropZone onFiles={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          {/* ----------------------【新增输入项：搜索与替换内容】---------------------- */}
          <div style={{ margin: "1rem 0" }}>
            <Label>搜索内容</Label>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="请输入要搜索的内容"
            />
          </div>
          <div style={{ margin: "1rem 0" }}>
            <Label>替换为</Label>
            <Input
              type="text"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              placeholder="请输入替换内容"
            />
          </div>
          {/* ----------------------【新增输入项结束】---------------------- */}
          <Button onClick={handleSearchAndReplace}>执行搜索替换</Button>
          {/* ----------------------【新增预览展示：显示搜索替换结果】---------------------- */}
          {replaceResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>搜索替换预览</h3>
              {replaceResults.map(result => (
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
