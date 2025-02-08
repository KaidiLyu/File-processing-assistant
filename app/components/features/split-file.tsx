import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SplitFile() {
  const [files, setFiles] = useState<File[]>([])
  const [splitMethod, setSplitMethod] = useState<"lines" | "size">("lines")
  const [splitValue, setSplitValue] = useState("")

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSplit = () => {
    console.log(`拆分文件：按${splitMethod === "lines" ? "行数" : "大小"}，值为${splitValue}`)
  }

  return (
    <FeatureLayout title="拆分文件">
      <div className="space-y-6">
        <DropZone
          onFileSelect={handleFiles}
          multiple={false}
          accept=".txt,.csv"
          activeMessage="释放以添加文件"
          inactiveMessage="拖放文本文件到这里，或点击选择文件"
        />

        {files.length > 0 && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="split-method">拆分方式</Label>
                <Select value={splitMethod} onValueChange={(value: "lines" | "size") => setSplitMethod(value)}>
                  <SelectTrigger id="split-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lines">按行数拆分</SelectItem>
                    <SelectItem value="size">按大小拆分</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="split-value">
                  {splitMethod === "lines" ? "每个文件的行数" : "每个文件的大小 (KB)"}
                </Label>
                <Input
                  id="split-value"
                  type="number"
                  min="1"
                  value={splitValue}
                  onChange={(e) => setSplitValue(e.target.value)}
                  placeholder={splitMethod === "lines" ? "例如：1000" : "例如：1024"}
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

            <Button onClick={handleSplit} className="px-8">
              拆分文件
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

