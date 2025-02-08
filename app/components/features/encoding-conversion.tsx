import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// ----------------------【新增实际转换操作：引入编码转换库】----------------------
import Encoding from "encoding-japanese"
// ----------------------【新增实际转换操作】----------------------

export function EncodingConversion() {
  const [files, setFiles] = useState([])
  const [sourceEncoding, setSourceEncoding] = useState("utf-8")
  const [targetEncoding, setTargetEncoding] = useState("utf-8")
  const [conversionResults, setConversionResults] = useState([])

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  async function convertEncoding(
    file: File,
    sourceEnc: string,
    targetEnc: string
  ): Promise<{ fileName: string; content: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          // 读取为 ArrayBuffer
          const buffer = reader.result as ArrayBuffer
          // 根据原始编码解码文本
          const decoder = new TextDecoder(sourceEnc)
          const text = decoder.decode(buffer)
          let convertedText = text
          if (targetEnc.toLowerCase() !== "utf-8") {
            // ----------------------【新增实际转换操作开始】----------------------
            // 将源编码和目标编码转换为大写格式，以匹配 encoding-japanese 的要求
            const sourceEncNormalized = sourceEnc.toUpperCase()
            const targetEncNormalized = targetEnc.toUpperCase()
            // 将字符串转换为字符代码数组
            const codeArray = Encoding.stringToCode(text)
            // 实际进行编码转换
            const convertedArray = Encoding.convert(codeArray, targetEncNormalized, sourceEncNormalized)
            // 将转换后的字符代码数组转换为字符串
            convertedText = Encoding.codeToString(convertedArray)
            // ----------------------【新增实际转换操作结束】----------------------
          }
          resolve({ fileName: file.name, content: convertedText })
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => reject(new Error("读取文件出错"))
      reader.readAsArrayBuffer(file)
    })
  }

  const handleConvert = () => {
    console.log(`转换编码：从 ${sourceEncoding} 到 ${targetEncoding}`)
    const promises = files.map((file: File) =>
      convertEncoding(file, sourceEncoding, targetEncoding)
    )
    Promise.all(promises)
      .then(results => {
        setConversionResults(results)
        console.log("编码转换完成", results)
      })
      .catch(err => {
        console.error("编码转换出错", err)
      })
  }

  return (
    <FeatureLayout>
      <DropZone onFiles={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          <div style={{ margin: "1rem 0" }}>
            <Label>原始编码</Label>
            <Select value={sourceEncoding} onValueChange={setSourceEncoding}>
              <SelectTrigger>
                <SelectValue placeholder="选择原始编码" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utf-8">UTF-8</SelectItem>
                <SelectItem value="gbk">GBK</SelectItem>
                <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
                {/* 根据需求增加其他编码选项 */}
              </SelectContent>
            </Select>
          </div>
          <div style={{ margin: "1rem 0" }}>
            <Label>目标编码</Label>
            <Select value={targetEncoding} onValueChange={setTargetEncoding}>
              <SelectTrigger>
                <SelectValue placeholder="选择目标编码" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utf-8">UTF-8</SelectItem>
                <SelectItem value="gbk">GBK</SelectItem>
                <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
                {/* 根据需求增加其他编码选项 */}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleConvert}>转换编码</Button>
          {conversionResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>编码转换预览</h3>
              {conversionResults.map((result) => (
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
        </>
      )}
    </FeatureLayout>
  )
}
