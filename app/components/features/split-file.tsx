import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input" // 【新增代码】
import { ExportFile } from "../ui/export-file"

// ----------------------【新增辅助函数：按固定行数拆分文件内容】----------------------
function splitFileContent(text: string, linesPerSplit: number): string[] {
  // 将文本按换行符拆分成数组
  const lines = text.split("\n")
  const parts: string[] = []
  // 按每块行数循环分割
  for (let i = 0; i < lines.length; i += linesPerSplit) {
    parts.push(lines.slice(i, i + linesPerSplit).join("\n"))
  }
  return parts
}
// ----------------------【新增辅助函数结束】----------------------

// 添加辅助函数：检测文件分隔符
function detectDelimiter(text: string): string {
  // 获取第一行作为样本
  const firstLine = text.split('\n')[0];

  // 检测常见的分隔符
  const delimiters = {
    ',': (firstLine.match(/,/g) || []).length,
    '\t': (firstLine.match(/\t/g) || []).length,
    ' ': (firstLine.match(/ +/g) || []).length  // 一个或多个空格
  };

  // 找出出现次数最多的分隔符
  const mostCommon = Object.entries(delimiters).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  return mostCommon[0];
}

// 修改 splitFileByFirstColumn 函数名和实现
function splitFileByColumnGroups(text: string, columnsPerGroup: number): string[] {
  const delimiter = detectDelimiter(text);
  const lines = text.split("\n").filter(line => line.trim() !== "");
  if (lines.length === 0) return [];

  // 使用检测到的分隔符分割列
  const totalColumns = lines[0].split(delimiter).length;
  const groups: string[][] = [];

  for (let i = 0; i < totalColumns; i += columnsPerGroup) {
    const currentGroup: string[] = [];

    lines.forEach(line => {
      const columns = line.split(delimiter).map(col => col.trim());
      const groupColumns = columns.slice(i, Math.min(i + columnsPerGroup, totalColumns));
      currentGroup.push(groupColumns.join(delimiter));
    });

    groups.push(currentGroup);
  }

  return groups.map(group => group.join("\n"));
}

// ----------------------【新增辅助函数：按列拆分文件内容】----------------------
function splitFileByColumns(text: string, leftColumnsCount: number): string[] {
  const delimiter = detectDelimiter(text);
  const lines = text.split("\n").filter(line => line.trim() !== "");
  const leftParts: string[] = [];
  const rightParts: string[] = [];

  lines.forEach(line => {
    const columns = line.split(delimiter).map(col => col.trim());
    if (columns.length <= leftColumnsCount) {
      leftParts.push(line);
      rightParts.push("");
    } else {
      const leftPart = columns.slice(0, leftColumnsCount).join(delimiter);
      const rightPart = columns.slice(leftColumnsCount).join(delimiter);
      leftParts.push(leftPart);
      rightParts.push(rightPart);
    }
  });

  return [leftParts.join("\n"), rightParts.join("\n")].filter(part => part.trim() !== "");
}
// ----------------------【新增辅助函数结束】----------------------

export function SplitFile() {
  const [files, setFiles] = useState<File[]>([])
  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList))
  }
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // ----------------------【新增状态：存储每个文件分割后的结果】----------------------
  const [splitResults, setSplitResults] = useState<Array<{ fileName: string; parts: string[]; delimiter: string }>>([])
  // ----------------------【新增状态结束】----------------------

  // ----------------------【新增状态：记录用户输入的拆分参数】----------------------
  // 此参数含义如下：
  // 正数 —— 按固定行数拆分（原有功能）
  // 0 —— 按第一列拆分（功能1）
  // 负数 —— 按列拆分，绝对值表示前几列数量（功能2）
  const [splitMode, setSplitMode] = useState<"lines" | "columnGroups" | "columns">("lines")
  const [linesPerSplit, setLinesPerSplit] = useState<string>("10")
  const [columnsCount, setColumnsCount] = useState<string>("2")
  const [columnsPerGroup, setColumnsPerGroup] = useState<string>("2");
  // ----------------------【新增状态结束】----------------------

  const handleSplit = () => {
    console.log("开始分割文件")
    const promises = files.map((file: File) => {
      return new Promise<{ fileName: string; parts: string[]; delimiter: string }>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            const text = reader.result as string;
            const delimiter = detectDelimiter(text);
            let parts: string[] = []

            switch (splitMode) {
              case "lines":
                const lines = Number(linesPerSplit)
                if (isNaN(lines) || lines <= 0) {
                  reject(new Error("请输入有效的行数"))
                  return
                }
                parts = splitFileContent(text, lines)
                break
              case "columnGroups":
                const columns = Number(columnsPerGroup)
                if (isNaN(columns) || columns <= 0) {
                  reject(new Error("请输入有效的列数"))
                  return
                }
                parts = splitFileByColumnGroups(text, columns)
                break
              case "columns":
                const splitColumns = Number(columnsCount)
                if (isNaN(splitColumns) || splitColumns <= 0) {
                  reject(new Error("请输入有效的列数"))
                  return
                }
                parts = splitFileByColumns(text, splitColumns)
                break
            }

            resolve({
              fileName: file.name,
              parts,
              delimiter
            })
          } else {
            reject(new Error("文件读取失败"))
          }
        }
        reader.onerror = () => reject(new Error("读取文件出错"))
        reader.readAsText(file)
      })
    })

    Promise.all(promises)
      .then(results => {
        setSplitResults(results)
        console.log("分割完成", results)
      })
      .catch(err => {
        console.error("分割过程中出错", err)
      })
  }
  const [isOpen, setIsOpen] = useState(false)

  return (
    <FeatureLayout>
      <DropZone onFileSelect={handleFiles} />
      {files.length > 0 && (
        <>
          <FileList files={files} onRemove={removeFile} />

          <div className="space-y-4 my-4">
            <Label>选择分割方式</Label>
            <select
              value={splitMode}
              onChange={(e) => setSplitMode(e.target.value as "lines" | "columnGroups" | "columns")}
              className="w-full p-2 border rounded-md"
            >
              <option value="lines">按行数分割</option>
              <option value="columnGroups">按列组分割</option>
              <option value="columns">按列分割(左右)</option>
            </select>

            {splitMode === "lines" && (
              <div className="space-y-2">
                <Label>每个分割块包含的行数</Label>
                <Input
                  type="number"
                  value={linesPerSplit}
                  onChange={(e) => setLinesPerSplit(e.target.value)}
                  placeholder="请输入每个块的行数"
                  min="1"
                />
              </div>
            )}

            {splitMode === "columnGroups" && (
              <div className="space-y-2">
                <Label>每组包含的列数</Label>
                <Input
                  type="number"
                  value={columnsPerGroup}
                  onChange={(e) => setColumnsPerGroup(e.target.value)}
                  placeholder="请输入每组的列数"
                  min="1"
                />
              </div>
            )}

            {splitMode === "columns" && (
              <div className="space-y-2">
                <Label>前几列作为一组</Label>
                <Input
                  type="number"
                  value={columnsCount}
                  onChange={(e) => setColumnsCount(e.target.value)}
                  placeholder="请输入列数"
                  min="1"
                />
              </div>
            )}
          </div>

          <Button onClick={handleSplit}>分割文件</Button>
          {splitResults.length > 0 && (
            <>
              <Button className="ml-3" onClick={() => setIsOpen(!isOpen)}>导出文件</Button>
              <ExportFile
                files={splitResults.flatMap((result, fileIndex) =>
                  result.parts.map((content, partIndex) => {
                    // 获取原始文件的扩展名
                    const originalExtension = result.fileName.split('.').pop() || 'txt';
                    const newFileName = `${result.fileName.replace(/\.[^/.]+$/, '')}_part${partIndex + 1}.${originalExtension}`;
                    return {
                      fileName: newFileName,
                      content: content
                    }
                  })
                )}
                isOpen={isOpen}
                onClose={() => setIsOpen(!isOpen)}
              />
            </>
          )}
          {/* ----------------------【新增预览展示：显示分割后的结果】---------------------- */}
          {splitResults.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h3>分割结果预览</h3>
              {splitResults.map(result => (
                <div key={result.fileName} style={{ marginBottom: "1rem" }}>
                  <h4>{result.fileName}</h4>
                  {result.parts.map((part, index) => (
                    <div key={index} style={{ marginBottom: "0.5rem" }}>
                      <strong>部分 {index + 1}:</strong>
                      <pre
                        style={{
                          background: "#f5f5f5",
                          padding: "0.5rem",
                          borderRadius: "4px",
                          overflowX: "auto"
                        }}
                      >
                        {part}
                      </pre>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {/* ----------------------【新增预览展示结束】---------------------- */}
        </>
      )}
    </FeatureLayout>
  )
}
