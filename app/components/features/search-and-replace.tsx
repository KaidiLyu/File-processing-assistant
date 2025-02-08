import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

export function SearchAndReplace() {
  const [files, setFiles] = useState<File[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [replaceTerm, setReplaceTerm] = useState("")
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [processAllFiles, setProcessAllFiles] = useState(false)
  const [useRegex, setUseRegex] = useState(false)

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSearchReplace = () => {
    console.log(`搜索 "${searchTerm}" 并替换为 "${replaceTerm}"`)
    console.log(`处理所有文件: ${processAllFiles}`)
    console.log(`区分大小写: ${caseSensitive}`)
    console.log(`使用正则表达式: ${useRegex}`)
  }

  return (
    <FeatureLayout title="搜索替换">
      <div className="space-y-6">
        <DropZone
          onFileSelect={handleFiles}
          multiple
          accept=".txt,.csv,.md"
          activeMessage="释放以添加文件"
          inactiveMessage="拖放文本文件到这里，或点击选择文件"
        />

        {files.length > 0 && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-term">搜索内容</Label>
                <Input
                  id="search-term"
                  placeholder="输入要搜索的内容"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="replace-term">替换内容</Label>
                <Input
                  id="replace-term"
                  placeholder="输入要替换的内容"
                  value={replaceTerm}
                  onChange={(e) => setReplaceTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="process-all-files" checked={processAllFiles} onCheckedChange={setProcessAllFiles} />
                <Label htmlFor="process-all-files">处理所有文件</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="case-sensitive" checked={caseSensitive} onCheckedChange={(checked) => setCaseSensitive(!!checked)} />
                <Label htmlFor="case-sensitive">区分大小写</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="use-regex" checked={useRegex} onCheckedChange={(checked) => setUseRegex(!!checked)} />
                <Label htmlFor="use-regex">使用正则表达式</Label>
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

            <Button onClick={handleSearchReplace} className="px-8">
              开始替换
            </Button>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

