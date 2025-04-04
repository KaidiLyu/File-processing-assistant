import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeatureLayout } from "../feature-layout"
import { DropZone } from "../ui/drop-zone"
import { FileList } from "../ui/file-list"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportFile } from "../ui/export-file"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

// 支持的文件格式
const supportedFormats = {
  'txt': ['pdf', 'html', 'docx', 'md'],
  'pdf': ['txt', 'html'],
  'docx': ['txt', 'pdf', 'html', 'md'],
  'html': ['txt', 'pdf'],
  'md': ['html', 'pdf', 'txt'],
  'csv': ['xlsx', 'json', 'txt'],
  'xlsx': ['csv', 'json', 'txt'],
  'json': ['csv', 'txt', 'xlsx']
};

// 检查文件扩展名
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function FileFormatConversion() {
  const [files, setFiles] = useState<File[]>([])
  const [targetFormat, setTargetFormat] = useState<string>("")
  const [availableFormats, setAvailableFormats] = useState<string[]>([])
  const [conversionResults, setConversionResults] = useState<Array<{ fileName: string; content: string | Blob }>>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleFiles = (fileList: FileList) => {
    const filesArray = Array.from(fileList);
    setFiles(filesArray);
    setConversionResults([]);
    setErrorMessage("");
    
    // 检查所有文件是否有相同的扩展名
    const extensions = filesArray.map(file => getFileExtension(file.name));
    const uniqueExtensions = Array.from(new Set(extensions));
    
    if (uniqueExtensions.length === 0) {
      setAvailableFormats([]);
      return;
    }
    
    if (uniqueExtensions.length > 1) {
      setErrorMessage("请上传相同类型的文件以批量转换格式");
      setAvailableFormats([]);
      return;
    }
    
    const sourceFormat = uniqueExtensions[0];
    const availableTargets = supportedFormats[sourceFormat as keyof typeof supportedFormats] || [];
    
    setAvailableFormats(availableTargets);
    if (availableTargets.length > 0) {
      setTargetFormat(availableTargets[0]);
    } else {
      setErrorMessage(`暂不支持 ${sourceFormat} 格式文件的转换`);
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    if (files.length <= 1) {
      setAvailableFormats([]);
      setConversionResults([]);
    }
  }

  const handleFormatConversion = () => {
    if (files.length === 0 || !targetFormat) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    // 这里模拟文件转换过程
    // 在实际应用中，这里会调用适当的库或API来执行真正的格式转换
    // 例如，可以使用jsPDF来转换PDF，使用mammoth.js转换DOCX等
    
    setTimeout(() => {
      const results = files.map(file => {
        const newFileName = file.name.replace(/\.[^.]+$/, `.${targetFormat}`);
        
        // 这里只是返回一个示例内容，实际应用需要替换为真实的转换结果
        const content = `这是文件 ${file.name} 转换为 ${targetFormat} 格式后的内容示例。
        
在实际应用中，这里会是转换后的${targetFormat}格式的实际内容。
由于浏览器安全限制和各种格式复杂性，真实格式转换通常需要:
1. 使用专门的JavaScript库，如jsPDF、mammoth.js等
2. 或者通过后端服务实现转换功能
        
源文件类型: ${getFileExtension(file.name)}
目标类型: ${targetFormat}
文件大小: ${file.size} 字节`;
        
        return {
          fileName: newFileName,
          content: content
        };
      });
      
      setConversionResults(results);
      setIsProcessing(false);
    }, 1500);
  }

  return (
    <FeatureLayout>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">文件格式转换</h3>
        <p className="text-sm text-muted-foreground">
          将文件从一种格式转换为另一种格式。目前支持txt、pdf、docx、html、md、csv、xlsx和json等格式。
        </p>
      </div>
      
      <DropZone onFileSelect={handleFiles} />
      
      {errorMessage && (
        <Alert className="mt-4" variant="destructive">
          <Info className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {files.length > 0 && (
        <>
          <FileList
            files={files}
            onRemove={removeFile}
            columns={{ name: true, size: true, type: true, lastModified: true }}
          />
          
          {availableFormats.length > 0 && (
            <div className="space-y-4 my-4">
              <div>
                <Label>选择目标格式</Label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择目标格式" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFormats.map(format => (
                      <SelectItem key={format} value={format}>
                        {format.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  当前文件类型为 {getFileExtension(files[0].name).toUpperCase()}，可转换为以上格式
                </p>
              </div>
              
              <Button onClick={handleFormatConversion} disabled={isProcessing}>
                {isProcessing ? "处理中..." : "转换格式"}
              </Button>
              
              {conversionResults.length > 0 && (
                <>
                  <Button className="ml-3" onClick={() => setIsOpen(!isOpen)}>导出文件</Button>
                  <ExportFile files={conversionResults} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)} />
                </>
              )}
              
              {conversionResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">转换结果预览</h3>
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      这是示例预览。在实际应用中，不是所有格式都能直接预览，可能需要下载后查看。
                    </AlertDescription>
                  </Alert>
                  {conversionResults.map(result => (
                    <div key={result.fileName} className="mb-4">
                      <h4 className="font-medium">{result.fileName}</h4>
                      {typeof result.content === 'string' ? (
                        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                          {result.content}
                        </pre>
                      ) : (
                        <div className="bg-muted p-4 rounded-md text-sm">
                          二进制内容，无法预览
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </FeatureLayout>
  )
} 