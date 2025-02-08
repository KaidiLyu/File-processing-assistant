import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DeleteRowRange() {
  const [files, setFiles] = useState<File[]>([])
  const [startRow, setStartRow] = useState("")
  const [endRow, setEndRow] = useState("")
  const [rangeType, setRangeType] = useState<"single" | "multiple">("single")
  const [ranges, setRanges] = useState<string[]>([])

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const addRange = () => {
    setRanges([...ranges, `${startRow}-${endRow}`])
    setStartRow("")
    setEndRow("")
  }

  const removeRange = (index: number) => {
    setRanges(ranges.filter((_, i) => i !== index))
  }

  const handleDeleteRows = () => {
    if (rangeType === "single") {
      console.log(`删除行范围：${startRow} 到 ${endRow}`)
    } else {
      console.log(`删除多个行范围：${ranges.join(", ")}`)
    }
  }

  return (
    <FeatureLayout title="删除行范围">
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
              <div className="flex items-center space-x-4">
                <Label>范围类型</Label>
                <Select value={rangeType} onValueChange={(value: "single" | "multiple") => setRangeType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">单一范围</SelectItem>
                    <SelectItem value="multiple">多个范围</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {rangeType === "single" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-row">起始行</Label>
                    <Input
                      id="start-row"
                      type="number"
                      min="1"
                      value={startRow}
                      onChange={(e) => setStartRow(e.target.value)}
                      placeholder="例如：1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-row">结束行</Label>
                    <Input
                      id="end-row"
                      type="number"
                      min="1"
                      value={endRow}
                      onChange={(e) => setEndRow(e.target.value)}
                      placeholder="例如：10"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-row">起始行</Label>
                      <Input
                        id="start-row"
                        type="number"
                        min="1"
                        value={startRow}
                        onChange={(e) => setStartRow(e.target.value)}
                        placeholder="例如：1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-row">结束行</Label>
                      <Input
                        id="end-row"
                        type="number"
                        min="1"
                        value={endRow}
                        onChange={(e) => setEndRow(e.target.value)}
                        placeholder="例如：10"
                      />
                    </div>
                  </div>
                  <Button onClick={addRange}>添加范围</Button>
                  {ranges.length > 0 && (
                    <div className="space-y-2">
                      <Label>已添加的范围</Label>
                      <ul className="space-y-2">
                        {ranges.map((range, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span>{range}</span>
                            <Button variant="ghost" size="sm" onClick={() => removeRange(index)}>
                              删除
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
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

