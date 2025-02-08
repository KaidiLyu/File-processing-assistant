import React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"

interface DropZoneProps {
  onFileSelect: (files: FileList) => void
  accept?: string
  multiple?: boolean
  className?: string
  activeMessage?: string
  inactiveMessage?: string
  icon?: React.ReactNode
}

export function DropZone({
  onFileSelect,
  accept,
  multiple = false,
  className,
  activeMessage = "释放文件以添加",
  inactiveMessage = "拖放文件到这里，或点击选择",
  icon = <Upload className="h-10 w-10" />,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files?.length) {
        onFileSelect(files)
      }
    },
    [onFileSelect],
  )

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <Card
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && onFileSelect(e.target.files)}
      />
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div
          className={cn("mb-4 transition-colors duration-200", isDragging ? "text-primary" : "text-muted-foreground")}
        >
          {icon}
        </div>
        <p className="text-sm font-medium">{isDragging ? activeMessage : inactiveMessage}</p>
      </div>
    </Card>
  )
}

