import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FeatureLayout } from "../feature-layout";
import { DropZone } from "../ui/drop-zone";
import { FileList } from "../ui/file-list";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import JSZip from "jszip";
import { ExportFile } from "../ui/export-file";
import FileSaver from "file-saver";

export function CompressFolder() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedContent, setCompressedContent] = useState<Blob | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [zipName, setZipName] = useState("compressed.zip");

  const handleFiles = (fileList: FileList) => {
    setFiles(Array.from(fileList));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleCompressAndDownload = async () => {
    const zip = new JSZip();
    const promises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      zip.file(file.name, arrayBuffer);
    });

    try {
      await Promise.all(promises);
      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 9 },
        mimeType: "application/zip",
      });
      setCompressedContent(content);
      setIsOpen(true);
      FileSaver.saveAs(content, zipName);
    } catch (error) {
      console.error("压缩文件时出错:", error);
    }
  };

  return (
    <FeatureLayout>
      <DropZone onFileSelect={handleFiles} />
      {files.length > 0 && (
        <>
          <div className="mt-4">
            <Label>压缩文件名</Label>
            <Input
              value={zipName}
              onChange={(e) => setZipName(e.target.value)}
              placeholder="输入压缩文件名"
              className="mt-2"
            />
          </div>

          <FileList
            files={files}
            onRemove={removeFile}
            columns={{
              name: true,
              size: true,
              type: true,
              lastModified: false,
            }}
          />

          <Button onClick={handleCompressAndDownload} className="mt-4">
            压缩并下载
          </Button>
        </>
      )}
    </FeatureLayout>
  );
}