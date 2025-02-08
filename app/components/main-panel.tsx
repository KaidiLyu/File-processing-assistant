import { BatchRename } from "./features/batch-rename"
import { MergeFiles } from "./features/merge-files"
import { SortByFirstColumn } from "./features/sort-by-first-column"
import { SearchAndReplace } from "./features/search-and-replace"
import { DeleteRowRange } from "./features/delete-row-range"
import { DeleteSpecificRow } from "./features/delete-specific-row"
import { AlignColumns } from "./features/align-columns"
import { SplitFile } from "./features/split-file"
import { RemoveBlankLines } from "./features/remove-blank-lines"
import { DeleteColumn } from "./features/delete-column"
import { MathOperations } from "./features/math-operations"
import { FilterData } from "./features/filter-data"
import { GroupAndAggregate } from "./features/group-and-aggregate"
import { EncodingConversion } from "./features/encoding-conversion"
import { CompressFolder } from "./features/compress-folder"
import { ExtractFiles } from "./features/extract-files"
import { TextFormatConversion } from "./features/text-format-conversion"

interface MainPanelProps {
  selectedFeature: string
}

export function MainPanel({ selectedFeature }: MainPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {selectedFeature === "batch-rename" ? (
        <BatchRename />
      ) : selectedFeature === "merge-files" ? (
        <MergeFiles />
      ) : selectedFeature === "sort-by-first-column" ? (
        <SortByFirstColumn />
      ) : selectedFeature === "search-and-replace" ? (
        <SearchAndReplace />
      ) : selectedFeature === "delete-row-range" ? (
        <DeleteRowRange />
      ) : selectedFeature === "delete-specific-row" ? (
        <DeleteSpecificRow />
      ) : selectedFeature === "align-columns" ? (
        <AlignColumns />
      ) : selectedFeature === "split-file" ? (
        <SplitFile />
      ) : selectedFeature === "remove-blank-lines" ? (
        <RemoveBlankLines />
      ) : selectedFeature === "delete-column" ? (
        <DeleteColumn />
      ) : selectedFeature === "math-operations" ? (
        <MathOperations />
      ) : selectedFeature === "filter-data" ? (
        <FilterData />
      ) : selectedFeature === "group-and-aggregate" ? (
        <GroupAndAggregate />
      ) : selectedFeature === "encoding-conversion" ? (
        <EncodingConversion />
      ) : selectedFeature === "compress-folder" ? (
        <CompressFolder />
      ) : selectedFeature === "extract-files" ? (
        <ExtractFiles />
      ) : selectedFeature === "text-format-conversion" ? (
        <TextFormatConversion />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">请从左侧选择功能</div>
      )}
    </div>
  )
}

