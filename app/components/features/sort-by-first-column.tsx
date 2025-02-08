import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function SortByFirstColumn() {
  const [files, setFiles] = useState<File[]>([])
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSort = () => {
    // 这里应该实现实际的排序逻辑
    console.log(`排序文件，顺序：${sortOrder}`)
  }

  return (
    <FeatureLayout title="按首列排序">
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
              <Label htmlFor="sort-order">排序顺序</Label>
              <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                <SelectTrigger id="sort-order">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">升序</SelectItem>
                  <SelectItem value="desc">降序</SelectItem>
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

            <Button onClick={handleSort} className="px-8">
              开始排序
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

