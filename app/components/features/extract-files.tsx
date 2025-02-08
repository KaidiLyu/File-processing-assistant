import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ExtractFiles() {
  const [files, setFiles] = useState<File[]>([])
  const [outputPath, setOutputPath] = useState("")

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleExtract = () => {
    console.log(`解压文件到：${outputPath}`)
  }

  return (
    <FeatureLayout title="解压文件">
      <div className="space-y-6">
        <DropZone
          onFileSelect={handleFiles}
          multiple={false}
          accept=".zip,.tar,.7z"
          activeMessage="释放以添加压缩文件"
          inactiveMessage="拖放压缩文件到这里，或点击选择"
        />

        {files.length > 0 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="output-path">解压路径</Label>
              <Input
                id="output-path"
                value={outputPath}
                onChange={(e) => setOutputPath(e.target.value)}
                placeholder="输入解压目标路径"
              />
            </div>

            <div className="rounded-md border">
              <FileList
                files={files}
                onRemove={removeFile}
                columns={{
                  name: true,
                  size: true,
                  type: true,
                  lastModified: false,
                }}
              />
            </div>

            <Button onClick={handleExtract} className="px-8">
              解压文件
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

