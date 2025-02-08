import { HelpCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 定义工具栏属性接口 | Define toolbar props interface
interface BottomToolbarProps {
  className?: string     // 自定义样式类 | Custom style class
  children: React.ReactNode
}

// 底部工具栏组件 | Bottom toolbar component
export function BottomToolbar({ className, children }: BottomToolbarProps) {
  return (
    // 工具栏容器 | Toolbar container
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      {/* 工具栏内容 | Toolbar content */}
      <div className="container flex h-16 items-center gap-4">
        {children}
      </div>
    </div>
  )
}

