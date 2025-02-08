import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Input } from "@/components/ui/input" // 【新增代码】引入 Input 组件
import { Label } from "@/components/ui/label" // 【新增代码】引入 Label 组件

export function MergeFiles() {
  const [files, setFiles] = useState([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新增状态：用于存储合并后的文件预览结果】----------------------
  const [mergeResult, setMergeResult] = useState("")
  // ----------------------【新增状态结束】----------------------

  // ----------------------【新增状态：用于输入合并时的分隔符】----------------------
  const [mergeDelimiter, setMergeDelimiter] = useState("\n")
  // ----------------------【新增状态结束】----------------------

  const handleMerge = () => {
    console.log("开始合并文件")
    const promises = files.map((file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result as string)
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
        // ----------------------【新增合并逻辑：使用分隔符合并所有文件内容】----------------------
        const mergedText = results.join(mergeDelimiter)
        setMergeResult(mergedText)
        console.log("合并完成", mergedText)
        // ----------------------【新增合并逻辑结束】----------------------
      })
      .catch(err => {
        console.error("合并文件出错", err)
      })
  }

  return (
    <FeatureLayout>
      <DropZone onFiles={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          {/* ----------------------【新增输入项：合并分隔符】---------------------- */}
          <div style={{ margin: "1rem 0" }}>
            <Label>合并分隔符</Label>
            <Input
              value={mergeDelimiter}
              onChange={(e) => setMergeDelimiter(e.target.value)}
              placeholder="输入用于分隔合并内容的字符串，默认换行"
            />
          </div>
          {/* ----------------------【新增输入项结束】---------------------- */}
          <Button onClick={handleMerge}>Merge Files</Button>
          {/* ----------------------【新增预览展示：显示合并结果】---------------------- */}
          {mergeResult && (
            <div style={{ marginTop: "1rem" }}>
              <h3>合并结果预览</h3>
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "1rem",
                  borderRadius: "4px",
                  overflowX: "auto"
                }}
              >
                {mergeResult}
              </pre>
            </div>
          )}
          {/* ----------------------【新增预览展示结束】---------------------- */}
        </>
      )}
    </FeatureLayout>
  )
}
