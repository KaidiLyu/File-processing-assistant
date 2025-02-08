import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronRight,
  FolderOpen,
  Search,
  Trash,
  Paperclip,
  AlignCenter,
  Scissors,
  Eraser,
  Calculator,
  Filter,
  PieChart,
  RefreshCcw,
  FileText,
  Archive,
  FolderDown,
  FileType,
} from "lucide-react"

const features = [
  {
    category: "文件操作",
    items: [
      { id: "sort-by-first-column", icon: FolderOpen, label: "按首列排序" },
      { id: "search-and-replace", icon: Search, label: "搜索替换" },
      { id: "delete-row-range", icon: Trash, label: "删除行范围" },
      { id: "delete-specific-row", icon: Trash, label: "删除指定行" },
      { id: "merge-files", icon: Paperclip, label: "合并文件" },
      { id: "align-columns", icon: AlignCenter, label: "对齐列" },
      { id: "split-file", icon: Scissors, label: "拆分文件" },
      { id: "remove-blank-lines", icon: Eraser, label: "清理空白行" },
    ],
  },
  {
    category: "数据处理",
    items: [
      { id: "delete-column", icon: Scissors, label: "删除列" },
      { id: "math-operations", icon: Calculator, label: "数学运算" },
      { id: "filter-data", icon: Filter, label: "过滤数据" },
      { id: "group-and-aggregate", icon: PieChart, label: "分组聚合" },
    ],
  },
  {
    category: "编码与转换",
    items: [
      { id: "encoding-conversion", icon: RefreshCcw, label: "编码转换" },
      { id: "batch-rename", icon: FileText, label: "批量重命名" },
      { id: "text-format-conversion", icon: FileType, label: "文本格式转换" },
    ],
  },
  {
    category: "文件压缩",
    items: [
      { id: "compress-folder", icon: Archive, label: "压缩文件夹" },
      { id: "extract-files", icon: FolderDown, label: "解压文件" },
    ],
  },
]

interface SidebarProps {
  selectedFeature: string
  onSelectFeature: (feature: string) => void
}

export function Sidebar({ selectedFeature, onSelectFeature }: SidebarProps) {
  return (
    <div className="w-64 bg-background/50 backdrop-blur-lg border-r p-2 overflow-y-auto">
      {features.map((category) => (
        <Collapsible key={category.category} defaultOpen>
          <CollapsibleTrigger className="flex items-center w-full p-2 text-sm font-semibold">
            <ChevronRight className="w-4 h-4 mr-2" />
            {category.category}
          </CollapsibleTrigger>
          <CollapsibleContent>
            {category.items.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "flex items-center w-full justify-start px-2 py-1 text-sm",
                  selectedFeature === item.id && "bg-accent text-accent-foreground",
                )}
                onClick={() => onSelectFeature(item.id)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}

