import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { getFileExtension, removeFileExtension } from "@/lib/utils"

export function BatchRename() {
  const [files, setFiles] = useState<File[]>([])
  const [prefix, setPrefix] = useState("")
  const [suffix, setSuffix] = useState("")
  const [startNumber, setStartNumber] = useState("1")
  const [numberWidth, setNumberWidth] = useState("3")
  const [keepExtension, setKeepExtension] = useState(true)
  const [renameMode, setRenameMode] = useState("prefix-suffix")
  const [progress, setProgress] = useState(0)

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const getNewFileName = (file: File, index: number): string => {
    const extension = getFileExtension(file.name)
    const nameWithoutExt = removeFileExtension(file.name)

    switch (renameMode) {
      case "prefix-suffix":
        return `${prefix}${nameWithoutExt}${suffix}${keepExtension ? `.${extension}` : ""}`
      case "number":
        const number = (Number(startNumber) + index).toString().padStart(Number(numberWidth), "0")
        return `${prefix}${number}${suffix}${keepExtension ? `.${extension}` : ""}`
      default:
        return file.name
    }
  }

  const handleRename = () => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10
      setProgress(currentProgress)
      if (currentProgress >= 100) {
        clearInterval(interval)
      }
    }, 200)
  }

  return (
    <FeatureLayout title="批量重命名文件">
      <div className="space-y-6">
        <DropZone
          onFileSelect={handleFiles}
          multiple
          activeMessage="释放以添加文件"
          inactiveMessage="拖放文件到这里，或点击选择文件"
        />

        {files.length > 0 && (
          <>
            <Tabs defaultValue="prefix-suffix" onValueChange={setRenameMode}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prefix-suffix">前缀后缀</TabsTrigger>
                <TabsTrigger value="number">序号命名</TabsTrigger>
              </TabsList>
              <TabsContent value="prefix-suffix" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prefix">前缀</Label>
                    <Input
                      id="prefix"
                      placeholder="输入前缀"
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suffix">后缀</Label>
                    <Input
                      id="suffix"
                      placeholder="输入后缀"
                      value={suffix}
                      onChange={(e) => setSuffix(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="number" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-number">起始序号</Label>
                    <Input
                      id="start-number"
                      type="number"
                      min="0"
                      value={startNumber}
                      onChange={(e) => setStartNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number-width">序号位数</Label>
                    <Select value={numberWidth} onValueChange={setNumberWidth}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 (1, 2, 3...)</SelectItem>
                        <SelectItem value="2">2 (01, 02, 03...)</SelectItem>
                        <SelectItem value="3">3 (001, 002, 003...)</SelectItem>
                        <SelectItem value="4">4 (0001, 0002, 0003...)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Switch id="keep-extension" checked={keepExtension} onCheckedChange={setKeepExtension} />
              <Label htmlFor="keep-extension">保留文件扩展名</Label>
            </div>

            <div className="rounded-md border">
              <FileList
                files={files}
                onRemove={removeFile}
                columns={{
                  name: true,
                  size: true,
                  type: false,
                  lastModified: false,
                }}
              />
            </div>

            <div className="space-y-4">
              <div className="rounded-md border">
                <FileList
                  files={files.map((file, index) => new File([file], getNewFileName(file, index), { type: file.type }))}
                  columns={{
                    name: true,
                    size: false,
                    type: false,
                    lastModified: false,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button onClick={handleRename} className="px-8">
                  应用更改
                </Button>
                {progress > 0 && (
                  <div className="flex-1 ml-6">
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

