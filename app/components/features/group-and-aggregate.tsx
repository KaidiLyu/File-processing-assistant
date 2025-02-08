import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GroupAndAggregate() {
  const [files, setFiles] = useState<File[]>([])
  const [groupByColumn, setGroupByColumn] = useState("")
  const [aggregateColumn, setAggregateColumn] = useState("")
  const [aggregateFunction, setAggregateFunction] = useState<"sum" | "average" | "count" | "min" | "max">("sum")

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleGroupAndAggregate = () => {
    console.log(`分组聚合：按列 ${groupByColumn} 分组，对列 ${aggregateColumn} 执行 ${aggregateFunction} 操作`)
  }

  return (
    <FeatureLayout title="分组聚合">
      <div className="space-y-6">
        <DropZone
          onFileSelect={handleFiles}
          multiple={false}
          accept=".csv,.txt"
          activeMessage="释放以添加文件"
          inactiveMessage="拖放CSV或TXT文件到这里，或点击选择文件"
        />

        {files.length > 0 && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-by-column">分组列号</Label>
                <Input
                  id="group-by-column"
                  type="number"
                  min="1"
                  value={groupByColumn}
                  onChange={(e) => setGroupByColumn(e.target.value)}
                  placeholder="例如：1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aggregate-column">聚合列号</Label>
                <Input
                  id="aggregate-column"
                  type="number"
                  min="1"
                  value={aggregateColumn}
                  onChange={(e) => setAggregateColumn(e.target.value)}
                  placeholder="例如：2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aggregate-function">聚合函数</Label>
                <Select
                  value={aggregateFunction}
                  onValueChange={(value: "sum" | "average" | "count" | "min" | "max") => setAggregateFunction(value)}
                >
                  <SelectTrigger id="aggregate-function">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sum">求和</SelectItem>
                    <SelectItem value="average">平均值</SelectItem>
                    <SelectItem value="count">计数</SelectItem>
                    <SelectItem value="min">最小值</SelectItem>
                    <SelectItem value="max">最大值</SelectItem>
                  </SelectContent>
                </Select>
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

            <Button onClick={handleGroupAndAggregate} className="px-8">
              执行分组聚合
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

