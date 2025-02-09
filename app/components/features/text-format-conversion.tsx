import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input" // 【新增代码】
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // 【新增代码】
import { ExportFile } from "../ui/export-file"

// ----------------------【新增辅助函数：文本格式转换】----------------------
function convertTextFormat(text: string, option: string): string {
  switch (option) {
    case "uppercase":
      return text.toUpperCase()
    case "lowercase":
      return text.toLowerCase()
    case "titlecase":
      // 将每个单词首字母大写，其余小写
      return text.split(/\s+/).map(word => {
        if (word.length === 0) return ""
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }).join(" ")
    case "sentencecase":
      // 句子格式：仅首字母大写，其余小写
      if (text.length === 0) return text
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    default:
      return text
  }
}
// ----------------------【新增辅助函数结束】----------------------

export function TextFormatConversion() {
  // 原有代码：文件上传及文件列表管理（保持不变）
  const [files, setFiles] = useState<File[]>([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新增状态：选择的文本转换方式】----------------------
  const [formatOption, setFormatOption] = useState("uppercase")
  // ----------------------【新增状态结束】----------------------

  // ----------------------【新增状态：存储转换后的预览结果】----------------------
  const [conversionResults, setConversionResults] = useState<Array<{ fileName: string; content: string }>>([])
  // ----------------------【新增状态结束】----------------------

  // ----------------------【新增逻辑：执行文本格式转换】----------------------
  const handleConvertFormat = () => {
    console.log(`文本转换方式：${formatOption}`)
    const promises = files.map((file: File) => {
      return new Promise<{ fileName: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const originalText = reader.result as string
            const convertedText = convertTextFormat(originalText, formatOption)
            resolve({ fileName: file.name, content: convertedText })
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
        setConversionResults(results)
        console.log("文本格式转换完成", results)
      })
      .catch(err => {
        console.error("文本格式转换过程中出错", err)
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
          {/* ----------------------【新增输入项：选择文本转换方式】---------------------- */}
          <div style={{ margin: "1rem 0" }}>
            <Label>选择转换方式</Label>
            <Select value={formatOption} onValueChange={(value: string) => setFormatOption(value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择转换方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uppercase">全部大写</SelectItem>
                <SelectItem value="lowercase">全部小写</SelectItem>
                <SelectItem value="titlecase">标题格式</SelectItem>
                <SelectItem value="sentencecase">句子格式</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* ----------------------【新增输入项结束】---------------------- */}
          <Button onClick={handleConvertFormat}>转换文本格式</Button>
          {conversionResults.length > 0 && (
            <>
              <Button className="ml-3" onClick={() => setIsOpen(!isOpen)}>导出文件</Button>
              <ExportFile files={conversionResults} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
            </>
          )}
          {/* ----------------------【新增预览展示：显示转换后的文本】---------------------- */}
          {conversionResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>转换预览</h3>
              {conversionResults.map(result => (
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
