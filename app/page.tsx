"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./components/sidebar"
import { MainPanel } from "./components/main-panel"
import { BottomToolbar } from "./components/bottom-toolbar"

export default function AppLayout() {
  const [selectedFeature, setSelectedFeature] = useState("sort-by-first-column")

  useEffect(() => {
    // 这里可以添加 Electron 特定的初始化代码
    if ((window as any).electron) {
      console.log("Running in Electron")
      // 可以在这里添加与 Electron 主进程通信的代码
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background/80 backdrop-blur-xl">
      {/* Title Bar */}
      <div className="h-8 bg-background/90 backdrop-blur-sm border-b flex items-center px-4">
        <h1 className="text-sm font-semibold">File Processor</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar selectedFeature={selectedFeature} onSelectFeature={setSelectedFeature} />

        {/* Main Panel */}
        <MainPanel selectedFeature={selectedFeature} />
      </div>

      {/* Bottom Toolbar */}
      <BottomToolbar />
    </div>
  )
}

