import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function CompressFolder() {
  const [files, setFiles] = useState<File[]>([])
  const [compressionType, setCompressionType] = useState<"zip" | "tar" | "7z">("zip")
  const [outputName, setOutputName] = useState("")

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleCompress = () => {
    console.log(`压缩文件夹：类型 ${compressionType}，输出文件名 ${outputName}`)
  }

  return (
    <FeatureLayout title="压缩文件夹">
      <div className="space-y-6">
        <DropZone
          onFileSelect={handleFiles}
          multiple
          activeMessage="释放以添加文件"
          inactiveMessage="拖放文件或文件夹到这里，或点击选择"
        />

        {files.length > 0 && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="compression-type">压缩类型</Label>
                <Select
                  value={compressionType}
                  onValueChange={(value: "zip" | "tar" | "7z") => setCompressionType(value)}
                >
                  <SelectTrigger id="compression-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zip">ZIP</SelectItem>
                    <SelectItem value="tar">TAR</SelectItem>
                    <SelectItem value="7z">7Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="output-name">输出文件名</Label>
                <Input
                  id="output-name"
                  value={outputName}
                  onChange={(e) => setOutputName(e.target.value)}
                  placeholder="输入压缩文件名（不包括扩展名）"
                />
              </div>
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

            <Button onClick={handleCompress} className="px-8">
              压缩文件夹
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

