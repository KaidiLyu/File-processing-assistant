import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"

export function DeleteSpecificRow() {
  const [files, setFiles] = useState<File[]>([])
  const [rowNumbers, setRowNumbers] = useState("")

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleDeleteRows = () => {
    console.log(`删除指定行：${rowNumbers}`)
  }

  return (
    <FeatureLayout title="删除指定行">
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
              <Label htmlFor="row-numbers">要删除的行号</Label>
              <Input
                id="row-numbers"
                value={rowNumbers}
                onChange={(e) => setRowNumbers(e.target.value)}
                placeholder="例如：1,3,5-7,10"
              />
              <p className="text-sm text-muted-foreground">输入单个行号、范围或逗号分隔的组合</p>
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

            <Button onClick={handleDeleteRows} className="px-8">
              删除行
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

