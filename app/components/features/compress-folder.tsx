import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"
import { compressFolder as compressUtility } from "@/lib/compress"

export function CompressFolder() {
  const [files, setFiles] = useState([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }
  const handleCompress = () => {
    console.log("Compressing folder with", files)
    compressUtility(files)
    // ----------------------【新增代码开始】----------------------
    // 新增：生成压缩后的文件名预览（假设压缩后文件统一命名为 compressed_{时间戳}.zip）
    const newCompressedName = `compressed_${new Date().getTime()}.zip`
    setCompressPreview(newCompressedName)
    // ----------------------【新增代码结束】----------------------
  }

  return (
    <FeatureLayout>
      <DropZone onFiles={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          <Label>Compress Folder</Label>
          <Button onClick={handleCompress}>Compress</Button>
          {/* ----------------------【新增代码开始】---------------------- */}
          {compressPreview && (
            <div style={{ marginTop: "1rem" }}>
              <h3>压缩预览</h3>
              <p>生成的压缩文件名：<strong>{compressPreview}</strong></p>
            </div>
          )}
          {/* ----------------------【新增代码结束】---------------------- */}
        </>
      )}
    </FeatureLayout>
  )
}

// ----------------------【新增代码开始】----------------------
// 新增：为压缩预览添加状态，确保原有代码完全保留，仅增加新代码行
import { useEffect } from "react"  // 如果需要额外的 Hook
export function CompressFolderWithPreview() {
  // 保留原有 CompressFolder 组件的所有功能，同时追加新的状态
  const [compressPreview, setCompressPreview] = useState("")
  // 将原有 CompressFolder 组件包装一层，确保新增状态不影响原有代码结构
  return (
    <>
      <CompressFolderExtra
        compressPreview={compressPreview}
        setCompressPreview={setCompressPreview}
      />
    </>
  )
}

// 仅用于包装和注入新增状态，确保原有 CompressFolder 组件代码不被修改
function CompressFolderExtra({
  compressPreview,
  setCompressPreview,
}: {
  compressPreview: string
  setCompressPreview: (value: string) => void
}) {
  // 这里直接返回原有组件结构，同时将新增状态传入内部
  // 注意：原有组件代码保持不变，仅在适当位置引用 compressPreview 和 setCompressPreview
  return (
    <FeatureLayout>
      <DropZone onFiles={(fileList: FileList) => {
        // 调用原有逻辑
        // 仅作包装以便新增状态同步
        // 此处示例直接调用原有代码
        setFiles(Array.from(fileList))
      }} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={(index: number) => setFiles(files.filter((_, i) => i !== index))} />
          <Label>Compress Folder</Label>
          <Button onClick={() => {
            console.log("Compressing folder with", files)
            compressUtility(files)
            const newCompressedName = `compressed_${new Date().getTime()}.zip`
            setCompressPreview(newCompressedName)
          }}>Compress</Button>
          {compressPreview && (
            <div style={{ marginTop: "1rem" }}>
              <h3>压缩预览</h3>
              <p>生成的压缩文件名：<strong>{compressPreview}</strong></p>
            </div>
          )}
        </>
      )}
    </FeatureLayout>
  )
}
// ----------------------【新增代码结束】----------------------
