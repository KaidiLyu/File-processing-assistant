import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input" // 【新增代码】
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // 【新增代码】
import { ExportFile } from "../ui/export-file"

// ----------------------【修改后的辅助函数：文件格式转换】----------------------
// 注意：这里仅为模拟转换，实际文件格式转换通常需要专门的库或服务
function convertTextFormat(text: string, option: string): string {
  switch (option) {
    case "pdfToDoc":
      return "【模拟 PDF 转 DOC】\n" + text
    case "docToTxt":
      return "【模拟 DOC 转 TXT】\n" + text
    case "csvToTxt":
      return "【模拟 CSV 转 TXT】\n" + text
    default:
      return text
  }
}
// ----------------------【辅助函数结束】----------------------

export function TextFormatConversion() {
  // 原有代码：文件上传及文件列表管理（保持不变）
  const [files, setFiles] = useState<File[]>([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【修改后的状态：选择的文件格式转换方式】----------------------
  const [formatOption, setFormatOption] = useState("pdfToDoc")
  // ----------------------【状态结束】----------------------

  // ----------------------【状态：存储转换后的预览结果】----------------------
  const [conversionResults, setConversionResults] = useState<Array<{ fileName: string; content: string }>>([])
  // ----------------------【状态结束】----------------------

  // ----------------------【修改后的逻辑：执行文件格式转换】----------------------
  const handleConvertFormat = () => {
    console.log(`文件格式转换方式：${formatOption}`)
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
        console.log("文件格式转换完成", results)
      })
      .catch(err => {
        console.error("文件格式转换过程中出错", err)
      })
  }
  // ----------------------【逻辑结束】----------------------
  const [isOpen, setIsOpen] = useState(false)

  return (
    <FeatureLayout>
      <DropZone onFileSelect={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          {/* ----------------------【修改后的输入项：选择文件格式转换方式】---------------------- */}
          <div style={{ margin: "1rem 0" }}>
            <Label>选择转换方式</Label>
            <Select value={formatOption} onValueChange={(value: string) => setFormatOption(value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择转换方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdfToDoc">PDF 转 DOC</SelectItem>
                <SelectItem value="docToTxt">DOC 转 TXT</SelectItem>
                <SelectItem value="csvToTxt">CSV 转 TXT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* ----------------------【输入项结束】---------------------- */}
          <Button onClick={handleConvertFormat}>转换文件格式</Button>
          {conversionResults.length > 0 && (
            <>
              <Button className="ml-3" onClick={() => setIsOpen(!isOpen)}>导出文件</Button>
              <ExportFile files={conversionResults} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
            </>
          )}
          {/* ----------------------【预览展示：显示转换后的文件内容】---------------------- */}
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
          {/* ----------------------【预览展示结束】---------------------- */}
        </>
      )}
    </FeatureLayout>
  )
}
