import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"

// ----------------------【新增代码：引入 JSZip 库】----------------------
import JSZip from "jszip"
// ----------------------【新增代码结束】----------------------

export function ExtractFiles() {
  const [files, setFiles] = useState([])
  
  // 原有代码部分保持不变
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }
  
  // ----------------------【新增状态：存储提取结果预览】----------------------
  const [extractionResults, setExtractionResults] = useState([])
  // ----------------------【新增状态结束】----------------------
  
  const handleExtract = () => {
    console.log("开始提取文件，上传文件数量：", files.length)
    // ----------------------【新增提取逻辑开始】----------------------
    const extractionPromises = files.map((file: File) => {
      return new Promise<{ fileName: string; extractedFiles: string[] }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            // 读取文件为 ArrayBuffer
            const arrayBuffer = reader.result as ArrayBuffer
            // 使用 JSZip 解析压缩包
            const zip = await JSZip.loadAsync(arrayBuffer)
            const fileNames: string[] = []
            // 遍历压缩包中所有文件，记录文件相对路径
            Object.keys(zip.files).forEach((relativePath) => {
              fileNames.push(relativePath)
            })
            resolve({ fileName: file.name, extractedFiles: fileNames })
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
  
  return (
    <FeatureLayout>
      <DropZone onFiles={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          <Button onClick={handleExtract}>提取文件</Button>
          {/* ----------------------【新增预览展示开始】---------------------- */}
          {extractionResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>提取结果预览</h3>
              {extractionResults.map((result) => (
                <div key={result.fileName} style={{ marginBottom: "1rem" }}>
                  <h4>{result.fileName}</h4>
                  <ul>
                    {result.extractedFiles.map((name, index) => (
                      <li key={index}>{name}</li>
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
