import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function RemoveBlankLines() {
  const [files, setFiles] = useState<File[]>([])
  const [removeWhitespace, setRemoveWhitespace] = useState(false)

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleRemoveBlankLines = () => {
    console.log(`清理空白行，移除只包含空白字符的行：${removeWhitespace}`)
  }

  return (
    <FeatureLayout title="清理空白行">
      <div className="space-y-6">
        <DropZone
          onFileSelect={handleFiles}
          multiple
          accept=".txt,.csv"
          activeMessage="释放以添加文件"
          inactiveMessage="拖放文本文件到这里，或点击选择文件"
        />

        {files.length > 0 && (
          <>
            <div className="flex items-center space-x-2">
              <Switch id="remove-whitespace" checked={removeWhitespace} onCheckedChange={setRemoveWhitespace} />
              <Label htmlFor="remove-whitespace">移除只包含空白字符的行</Label>
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

            <Button onClick={handleRemoveBlankLines} className="px-8">
              清理空白行
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

