# Mac OS Style App Layout

A desktop application built with Next.js and Electron, featuring a Mac OS-style interface. This application provides powerful text processing capabilities with a modern, user-friendly interface.

## Features

### Text Processing Tools

1. **Search and Replace**
   - **Multiple File Support**: Process multiple text files (txt, csv, md) simultaneously
   - **Case-sensitive Search**: Option to match exact letter casing
   - **Regular Expression**: Advanced pattern matching using regex
   - **Batch Processing**: Process multiple files in one operation
   - **Real-time Preview**: See changes before applying them
   - **Drag and Drop**: Easy file import through drag and drop
   - **File Validation**: Checks for file type and size limits
   - **Progress Tracking**: Visual feedback during operations

2. **File Management**
   - **Drag and Drop Interface**: Intuitive file importing
   - **File Type Filtering**: Only accept supported file types
   - **File Size Display**: Show file sizes in readable format
   - **File Type Icons**: Visual indicators for different file types
   - **File Removal**: Remove individual files from the queue
   - **Bulk Clear**: Clear all files at once
   - **Sortable List**: Sort files by name, size, or type

### UI Components

- **Modern Interface**
  - **Window Controls**: Mac OS style minimize/maximize/close buttons
  - **Responsive Layout**: Adapts to different window sizes
  - **Theme Support**: Switch between dark and light modes
  - **Animations**: Smooth transitions and feedback
  - **Notifications**: Toast messages for operation status
  - **Loading States**: Visual feedback during processes

- **Technical Stack**
  - **Next.js 14**: React framework for the frontend
  - **Electron**: Desktop application wrapper
  - **Radix UI**: Accessible component library
  - **Tailwind CSS**: Utility-first styling
  - **TypeScript**: Static typing for better reliability

## Current Issues

The main build process is facing several configuration challenges:

1. **Main Process File**
   - TypeScript compilation not working for `electron/main.ts`
   - Configuration needs adjustment for proper TypeScript support
   - Path resolution issues in production environment

2. **Build Process Errors**
   - Missing `main.js` in dist directory
   - Next.js static export not properly configured
   - Electron bundling incomplete

## Development Setup

```bash
# Install all dependencies
npm install

# Development Mode
npm run dev          # Start Next.js development server
npm run electron:serve   # Start Electron in development mode

# Production Build
npm run electron:build   # Build for production
```

## Project Structure

```
├── app/                        # Next.js 应用目录 | Next.js app directory
│   ├── components/            # 应用级组件 | Application-level components
│   │   ├── feature-layout.tsx # 功能布局组件 | Feature layout component
│   │   └── bottom-toolbar.tsx # 底部工具栏组件 | Bottom toolbar component
│   └── layout.tsx            # 根布局组件 | Root layout component
├── electron/                  # Electron 相关文件 | Electron-related files
│   └── main.ts               # 主进程文件 | Main process file
├── styles/                   # 样式文件 | Style files
│   └── globals.css          # 全局样式 | Global styles
├── lib/                     # 工具函数库 | Utility functions
├── public/                  # 静态资源 | Static assets
└── dist/                    # 构建输出 | Build output
    └── renderer/           # 渲染进程输出 | Renderer process output
```

### 关键文件说明 (Key Files Description)

- `electron/main.ts`: Electron 主进程，处理应用生命周期和原生功能
- `app/layout.tsx`: Next.js 根布局，定义应用的基本结构
- `styles/globals.css`: 全局样式定义，包含主题变量和基础样式
- `tailwind.config.ts`: Tailwind CSS 配置，定义主题和样式系统

## Environment Requirements

- **Node.js 18+**: JavaScript runtime
- **TypeScript 5+**: Type checking and compilation
- **Next.js 14**: React framework
- **Electron**: Desktop application framework
- **React 18**: UI library
- **Operating System Support**:
  - macOS 10.15+: Full native support
  - Windows 10+: Full compatibility
  - Linux: Major distribution support

## To-Do

### Build Process
- [x] Fix TypeScript compilation issues
- [x] Streamline build pipeline
- [x] Optimize production build

### Features
- [x] Add file content preview functionality
- [ ] Implement search history tracking
- [x] Add confirmation dialog for replacements

### Error Handling
- [ ] Implement robust file operation error handling
- [ ] Add error recovery system
- [ ] Create comprehensive error logging

### Testing
- [ ] Implement unit tests for core functions
- [ ] Add integration tests for features
- [ ] Set up end-to-end testing

## Contributing

We welcome contributions! Please read our contributing guidelines for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# File-processing-tools
# File-APP
