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
import { ExportFile } from "../ui/export-file"

export function BatchRename() {
  const [files, setFiles] = useState<File[]>([])
  const [prefix, setPrefix] = useState("")
  const [suffix, setSuffix] = useState("")
  const [startNumber, setStartNumber] = useState("1")
  const [numberWidth, setNumberWidth] = useState("3")
  const [keepExtension, setKeepExtension] = useState(true)
  const [renameMode, setRenameMode] = useState("prefix-suffix")
  const [progress, setProgress] = useState(0)
  // ----------------------【新增状态开始】----------------------
  const [renameResults, setRenameResults] = useState<{ original: string; newName: string, content: string }[]>([])
  // ----------------------【新增状态结束】----------------------

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

  const handleRename = async () => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10
      setProgress(currentProgress)
      if (currentProgress >= 100) {
        clearInterval(interval)
        // 读取文件内容并生成结果
        Promise.all(
          files.map(async (file: File, index: number) => {
            const content = await file.text() // 读取文件内容
            return {
              original: file.name,
              newName: getNewFileName(file, index),
              content: content
            }
          })
        ).then((results) => {
          setRenameResults(results)
        })
      }
    }, 200)
  }
  const [isOpen, setIsOpen] = useState(false)

  return (
    <FeatureLayout>
      <DropZone onFileSelect={handleFiles} />
      {files.length > 0 && (
        <>
          <Tabs defaultValue="prefix-suffix" className="mt-4">
            <TabsList>
              <TabsTrigger value="prefix-suffix" onClick={() => setRenameMode("prefix-suffix")}>
                前缀后缀
              </TabsTrigger>
              <TabsTrigger value="number" onClick={() => setRenameMode("number")}>
                序号命名
              </TabsTrigger>
            </TabsList>
            <TabsContent value="prefix-suffix">
              <div className="mt-4">
                <Label>前缀</Label>
                <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
              </div>
              <div className="mt-4">
                <Label>后缀</Label>
                <Input value={suffix} onChange={(e) => setSuffix(e.target.value)} />
              </div>
            </TabsContent>
            <TabsContent value="number">
              <div className="mt-4">
                <Label>前缀</Label>
                <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} />
              </div>
              <div className="mt-4">
                <Label>起始序号</Label>
                <Input value={startNumber} onChange={(e) => setStartNumber(e.target.value)} />
              </div>
              <div className="mt-4">
                <Label>序号位数</Label>
                <Select value={numberWidth} onValueChange={setNumberWidth}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择位数" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (1, 2, 3...)</SelectItem>
                    <SelectItem value="2">2 (01, 02, 03...)</SelectItem>
                    <SelectItem value="3">3 (001, 002, 003...)</SelectItem>
                    <SelectItem value="4">4 (0001, 0002, 0003...)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4">
                <Label>后缀</Label>
                <Input value={suffix} onChange={(e) => setSuffix(e.target.value)} />
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            <Label>
              <Switch checked={keepExtension} onCheckedChange={setKeepExtension} /> 保留文件扩展名
            </Label>
          </div>
          <FileList
            files={files}
            onRemove={removeFile}
            // 假设 FileList 组件接收 columns 属性展示文件信息
            columns={{
              name: true,
              size: false,
              type: false,
              lastModified: false,
            }}
          />
          <Button onClick={handleRename} className="mt-4">
            应用更改
          </Button>
          {renameResults.length > 0 && (
            <>
              <Button className="ml-3" onClick={() => setIsOpen(!isOpen)}>导出文件</Button>
              <ExportFile files={renameResults.map(result => ({
                fileName: result.newName,
                content: result.content
              }))} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
            </>
          )}
          {progress > 0 && (
            <Progress value={progress} className="mt-4" />
          )}
          {/* ----------------------【新增重命名预览展示开始】---------------------- */}
          {renameResults.length > 0 && (
            <div className="mt-4">
              <h3>重命名预览</h3>
              <ul>
                {renameResults.map((result: { original: string; newName: string }) => (
                  <li key={result.original}>
                    <strong>{result.original}</strong> → {result.newName}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* ----------------------【新增重命名预览展示结束】---------------------- */}
        </>
      )}
    </FeatureLayout>
  )
}
