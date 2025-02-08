import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import type { FileList } from "../ui/file-list"
import { Card } from "@/components/ui/card"
import { ArrowDown } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

export function MergeFiles() {
  const [files, setFiles] = useState<File[]>([])
  const [outputName, setOutputName] = useState("")

  const handleFiles = (fileList: FileList) => {
    setFiles((prev) => [...prev, ...Array.from(fileList)])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(files)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFiles(items)
  }

  return (
    <FeatureLayout title="合并文件">
      <div className="space-y-6">
        <DropZone
          onFileSelect={handleFiles}
          multiple
          activeMessage="释放以添加文件"
          inactiveMessage="拖放文件到这里，或点击选择文件"
        />

        {files.length > 0 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="output-name">输出文件名</Label>
              <Input
                id="output-name"
                placeholder="输入合并后的文件名"
                value={outputName}
                onChange={(e) => setOutputName(e.target.value)}
              />
            </div>

            <Card className="overflow-hidden">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="files">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="divide-y">
                      {files.map((file, index) => (
                        <Draggable key={index} draggableId={`file-${index}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between p-4 bg-background hover:bg-accent/50"
                            >
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-muted-foreground">{index + 1}</span>
                                <span className="font-mono">{file.name}</span>
                              </div>
                              <div className="flex items-center space-x-4">
                                {index < files.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" />}
                                <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                                  ✕
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Card>

            <div className="flex items-center justify-between">
              <Button className="px-8">合并文件</Button>
              <p className="text-sm text-muted-foreground">拖动文件可以调整合并顺序</p>
            </div>
          </>
        )}
      </div>
    </FeatureLayout>
  )
}

