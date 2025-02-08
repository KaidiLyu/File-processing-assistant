// 导入必要的 Electron 组件和类型
// Import required Electron components and types
import { IpcMainEvent } from 'electron'
const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const url = require("url")

// 定义主窗口变量
// Define main window variable
let mainWindow: typeof BrowserWindow | null

// 创建主应用窗口
// Create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,      // 启用 Node.js 集成 | Enable Node.js integration
      contextIsolation: false,    // 禁用上下文隔离 | Disable context isolation
      webSecurity: false          // 禁用 web 安全性(开发模式) | Disable web security (development mode)
    },
  })

  // 根据环境加载不同的页面
  // Load different pages based on environment
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000")  // 开发环境 | Development environment
  } else {
    mainWindow.loadURL(                          // 生产环境 | Production environment
      url.format({
        pathname: path.join(__dirname, '../dist/renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    )
  }

  // 打开开发者工具
  // Open DevTools
  mainWindow.webContents.openDevTools()

  // 监听窗口关闭事件
  // Listen for window close event
  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

// 应用程序生命周期事件监听
// Application lifecycle event listeners
app.on("ready", createWindow)

// 当所有窗口关闭时退出应用（Windows & Linux）
// Quit when all windows are closed (Windows & Linux)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// macOS 激活应用时重新创建窗口
// Recreate window on macOS app activation
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC 通信事件处理
// IPC communication event handling
ipcMain.on("message", (_event: IpcMainEvent, message: string) => {
  console.log(message)
})

