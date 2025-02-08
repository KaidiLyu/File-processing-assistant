import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function EncodingConversion() {
  const [files, setFiles] = useState<File[]>([])
  const [sourceEncoding, setSourceEncoding] = useState("UTF-8")
  const [targetEncoding, setTargetEncoding] = useState("UTF-8")

  const encodings = ["UTF-8", "GBK", "ISO-8859-1", "ASCII", "UTF-16"]

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleConvert = () => {
    console.log(`转换编码：从 ${sourceEncoding} 到 ${targetEncoding}`)
  }

  return (
    <FeatureLayout title="编码转换">
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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source-encoding">源编码</Label>
                <Select value={sourceEncoding} onValueChange={setSourceEncoding}>
                  <SelectTrigger id="source-encoding">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {encodings.map((encoding) => (
                      <SelectItem key={encoding} value={encoding}>
                        {encoding}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-encoding">目标编码</Label>
                <Select value={targetEncoding} onValueChange={setTargetEncoding}>
                  <SelectTrigger id="target-encoding">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {encodings.map((encoding) => (
                      <SelectItem key={encoding} value={encoding}>
                        {encoding}
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
              转换编码
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

