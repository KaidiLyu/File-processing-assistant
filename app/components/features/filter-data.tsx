import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FilterData() {
  const [files, setFiles] = useState<File[]>([])
  const [columnNumber, setColumnNumber] = useState("")
  const [filterCondition, setFilterCondition] = useState<"equals" | "contains" | "greater" | "less">("equals")
  const [filterValue, setFilterValue] = useState("")

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleFilter = () => {
    console.log(`过滤数据：列号 ${columnNumber}，条件 ${filterCondition}，值 ${filterValue}`)
  }

  return (
    <FeatureLayout title="过滤数据">
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="column-number">列号</Label>
                <Input
                  id="column-number"
                  type="number"
                  min="1"
                  value={columnNumber}
                  onChange={(e) => setColumnNumber(e.target.value)}
                  placeholder="例如：1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-condition">过滤条件</Label>
                <Select
                  value={filterCondition}
                  onValueChange={(value: "equals" | "contains" | "greater" | "less") => setFilterCondition(value)}
                >
                  <SelectTrigger id="filter-condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">等于</SelectItem>
                    <SelectItem value="contains">包含</SelectItem>
                    <SelectItem value="greater">大于</SelectItem>
                    <SelectItem value="less">小于</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-value">过滤值</Label>
                <Input
                  id="filter-value"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="输入过滤值"
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

            <Button onClick={handleFilter} className="px-8">
              过滤数据
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

