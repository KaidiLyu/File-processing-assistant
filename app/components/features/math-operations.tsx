"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MathOperations() {
  const [files, setFiles] = useState<File[]>([])
  const [operation, setOperation] = useState<"sum" | "average" | "min" | "max" | "multiply" | "divide" | "sqrt">("sum")
  const [columnNumber, setColumnNumber] = useState("")

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleCalculate = () => {
    console.log(`执行${operation}运算，列号：${columnNumber}`)
  }

  return (
    <FeatureLayout title="数学运算">
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
                <Label htmlFor="operation">运算类型</Label>
                <Select
                  value={operation}
                  onValueChange={(value: "sum" | "average" | "min" | "max" | "multiply" | "divide" | "sqrt") =>
                    setOperation(value)
                  }
                >
                  <SelectTrigger id="operation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sum">求和</SelectItem>
                    <SelectItem value="average">平均值</SelectItem>
                    <SelectItem value="min">最小值</SelectItem>
                    <SelectItem value="max">最大值</SelectItem>
                    <SelectItem value="multiply">相乘</SelectItem>
                    <SelectItem value="divide">相除</SelectItem>
                    <SelectItem value="sqrt">开根</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

            <Button onClick={handleCalculate} className="px-8">
              执行运算
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

