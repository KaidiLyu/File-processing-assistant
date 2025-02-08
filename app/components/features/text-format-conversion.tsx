"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const fileFormats = [
  "txt",
  "doc",
  "docx",
  "pdf",
  "rtf",
  "odt",
  "html",
  "md",
  "epub",
  "mobi",
  "azw3",
  "fb2",
  "djvu",
  "xls",
  "xlsx",
  "csv",
  "ods",
  "ppt",
  "pptx",
  "odp",
]

export function TextFormatConversion() {
  const [files, setFiles] = useState<File[]>([])
  const [targetFormat, setTargetFormat] = useState(fileFormats[0])

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleConvert = () => {
    console.log(`转换文件格式为：${targetFormat}`)
  }

  return (
    <FeatureLayout title="文本格式转换">
      <div className="space-y-6">
        <DropZone
          onFileSelect={handleFiles}
          multiple
          accept={fileFormats.map((format) => `.${format}`).join(",")}
          activeMessage="释放以添加文件"
          inactiveMessage="拖放文件到这里，或点击选择文件"
        />

        {files.length > 0 && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target-format">目标格式</Label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger id="target-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fileFormats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format.toUpperCase()}
                      </SelectItem>
                    ))}
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

            <Button onClick={handleConvert} className="px-8">
              转换格式
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

