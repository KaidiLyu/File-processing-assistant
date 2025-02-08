import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function AlignColumns() {
  const [files, setFiles] = useState<File[]>([])
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left")

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleAlign = () => {
    console.log(`对齐列：${alignment}`)
  }

  return (
    <FeatureLayout title="对齐列">
      <div className="space-y-6">
        <DropZone
          onFileSelect={handleFiles}
          multiple
          accept=".csv,.txt"
          activeMessage="释放以添加文件"
          inactiveMessage="拖放CSV或TXT文件到这里，或点击选择文件"
        />

        {files.length > 0 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="alignment">对齐方式</Label>
              <Select value={alignment} onValueChange={(value: "left" | "center" | "right") => setAlignment(value)}>
                <SelectTrigger id="alignment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">左对齐</SelectItem>
                  <SelectItem value="center">居中对齐</SelectItem>
                  <SelectItem value="right">右对齐</SelectItem>
                </SelectContent>
              </Select>
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

            <Button onClick={handleAlign} className="px-8">
              对齐列
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

