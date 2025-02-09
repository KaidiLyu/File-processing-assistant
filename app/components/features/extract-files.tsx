import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"

// ----------------------【新增代码：引入 JSZip 库】----------------------
import JSZip from "jszip"
import { ExportFile } from "../ui/export-file"
// ----------------------【新增代码结束】----------------------

export function ExtractFiles() {
  const [files, setFiles] = useState<File[]>([])

  // 原有代码部分保持不变
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新增状态：存储提取结果预览】----------------------
  const [extractionResults, setExtractionResults] = useState<{
    fileName: string;
    extractedFiles: Array<{
      name: string;
      content: string;
    }>;
  }[]>([])
  // ----------------------【新增状态结束】----------------------

  const handleExtract = () => {
    console.log("开始提取文件，上传文件数量：", files.length)
    // ----------------------【新增提取逻辑开始】----------------------
    const extractionPromises = files.map((file: File) => {
      return new Promise<{
        fileName: string;
        extractedFiles: Array<{ name: string; content: string }>;
      }>(async (resolve, reject) => {
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const arrayBuffer = reader.result as ArrayBuffer
            const zip = await JSZip.loadAsync(arrayBuffer)

            const filePromises: Promise<{ name: string; content: string }>[] = []

            zip.forEach((relativePath, zipEntry) => {
              if (!zipEntry.dir) {
                // 根据文件类型选择适当的解压方式
                const filePromise = zipEntry.async('blob').then(async blob => {
                  // 对于文本文件，转换为字符串
                  if (relativePath.match(/\.(txt|json|md|csv|html|css|js|tsx|jsx)$/i)) {
                    const text = await new Response(blob).text()
                    return {
                      name: relativePath,
                      content: text
                    }
                  }
                  // 对于二进制文件，保持为 blob
                  return {
                    name: relativePath,
                    content: URL.createObjectURL(blob)
                  }
                })
                filePromises.push(filePromise)
              }
            })

            const extractedFiles = await Promise.all(filePromises)

            resolve({
              fileName: file.name,
              extractedFiles
            })
          } catch (err) {
            reject(err)
          }
        }
        reader.onerror = () => reject(new Error("读取文件出错"))
        reader.readAsArrayBuffer(file)
      })
    })

    Promise.all(extractionPromises)
      .then(results => {
        setExtractionResults(results)
        console.log("提取完成", results)
      })
      .catch(err => {
        console.error("提取过程中出错", err)
      })
    // ----------------------【新增提取逻辑结束】----------------------
  }
  const [isOpen, setIsOpen] = useState(false)

  return (
    <FeatureLayout>
      <DropZone onFileSelect={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          <Button onClick={handleExtract}>提取文件</Button>
          {extractionResults.length > 0 && (
            <>
              <Button className="ml-3" onClick={() => setIsOpen(!isOpen)}>导出文件</Button>
              <ExportFile
                files={extractionResults.flatMap(result =>
                  result.extractedFiles.map(file => ({
                    fileName: file.name,
                    content: file.content
                  }))
                )}
                isOpen={isOpen}
                onClose={() => setIsOpen(!isOpen)}
              />
            </>
          )}
          {/* ----------------------【新增预览展示开始】---------------------- */}
          {extractionResults.length > 0 && (
            <div className="mt-4">
              <h3>提取结果预览</h3>
              {extractionResults.map((result) => (
                <div key={result.fileName} className="mb-4">
                  <h4>{result.fileName}</h4>
                  <ul>
                    {result.extractedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
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
