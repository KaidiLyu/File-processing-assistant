import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { formatFileSize } from "@/lib/utils"

interface FileListProps {
  files: File[]
  onRemove?: (index: number) => void
  columns?: {
    name?: boolean
    size?: boolean
    type?: boolean
    lastModified?: boolean
  }
}

export function FileList({ files, onRemove, columns = { name: true, size: true, type: true } }: FileListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          {columns.name && <TableHead>文件名</TableHead>}
          {columns.size && <TableHead className="w-32">大小</TableHead>}
          {columns.type && <TableHead className="w-32">类型</TableHead>}
          {columns.lastModified && <TableHead className="w-40">修改时间</TableHead>}
          {onRemove && <TableHead className="w-16"></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file, index) => (
          <TableRow key={index}>
            <TableCell className="text-muted-foreground">{index + 1}</TableCell>
            {columns.name && <TableCell className="font-mono">{file.name}</TableCell>}
            {columns.size && <TableCell className="text-muted-foreground">{formatFileSize(file.size)}</TableCell>}
            {columns.type && <TableCell className="text-muted-foreground">{file.type || "未知"}</TableCell>}
            {columns.lastModified && (
              <TableCell className="text-muted-foreground">{new Date(file.lastModified).toLocaleString()}</TableCell>
            )}
            {onRemove && (
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => onRemove(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

