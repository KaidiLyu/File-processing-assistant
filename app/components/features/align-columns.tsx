import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "../ui/label"

// 添加一个辅助函数，用于对文本的各列进行对齐处理
function alignText(text: string, alignment: "left" | "center" | "right"): string {
  // 按行拆分文本，并使用连续空白字符作为分隔符拆分列
  const lines = text.split("\n")
  const rows = lines.map(line => line.trim().split(/\s+/))
  // 计算所有行中各列的最大宽度
  const colCount = Math.max(...rows.map(row => row.length))
  const colWidths = Array(colCount).fill(0)
  rows.forEach(row => {
    row.forEach((cell, i) => {
      if (cell.length > colWidths[i]) colWidths[i] = cell.length
    })
  })
  // 根据对齐方式为每个单元格添加左右填充
  const alignedRows = rows.map(row => {
    return row.map((cell, i) => {
      const width = colWidths[i]
      if (alignment === "left") {
        return cell.padEnd(width, " ")
      } else if (alignment === "right") {
        return cell.padStart(width, " ")
      } else { // center
        const totalPad = width - cell.length
        const padLeft = Math.floor(totalPad / 2)
        const padRight = totalPad - padLeft
        return " ".repeat(padLeft) + cell + " ".repeat(padRight)
      }
    }).join("  ") // 两个空格作为列之间的间隔
  })
  return alignedRows.join("\n")
}

export function AlignColumns() {
  const [files, setFiles] = useState<File[]>([])
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left")
  // 添加一个状态用于保存各个文件的处理结果
  const [results, setResults] = useState<Array<{ fileName: string; content: string }>>([])

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
    // 当添加新文件时清空之前的处理结果
    setResults([])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleAlign = () => {
    console.log(`对齐列：${alignment}`)
    // 针对每个文件，异步读取内容并进行对齐处理
    const promises = files.map(file => {
      return new Promise<{ fileName: string; content: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const originalText = reader.result as string
            const alignedContent = alignText(originalText, alignment)
            resolve({ fileName: file.name, content: alignedContent })
          } else {
            reject(new Error("文件读取失败"))
          }
        }
        reader.onerror = () => reject(new Error("读取文件出错"))
        reader.readAsText(file)
      })
    })

    Promise.all(promises)
      .then(res => {
        setResults(res)
        console.log("文件对齐完成", res)
      })
      .catch(err => {
        console.error("文件对齐过程中出错", err)
      })
  }

  return (
    <FeatureLayout>
      <DropZone onFiles={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />
          <div className="mt-4">
            <Label>对齐方式</Label>
            <Select
              value={alignment}
              onValueChange={(value: "left" | "center" | "right") => setAlignment(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择对齐方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">左对齐</SelectItem>
                <SelectItem value="center">居中对齐</SelectItem>
                <SelectItem value="right">右对齐</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAlign} className="mt-4">
            对齐列
          </Button>
          {/* 添加一个新的展示区域，显示每个文件对齐后的结果 */}
          {results.length > 0 && (
            <div className="mt-4">
              <h3>对齐结果</h3>
              {results.map(result => (
                <div key={result.fileName} className="mb-4">
                  <h4>{result.fileName}</h4>
                  <pre className="p-2 bg-gray-100 rounded whitespace-pre-wrap">
                    {result.content}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </FeatureLayout>
  )
}
