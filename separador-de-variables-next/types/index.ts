export interface UploadFileResponse {
  file_id: string
  filename: string
  message: string
}

export interface HeaderDataItem {
  header: string
  total_count: number
  unique_count: number
}

export interface GetHeadersDataResponse {
  headers_data: HeaderDataItem[]
}

export interface HeadersResponse {
  headers: string[]
}

export interface SetHeadersToKeepResponse {
  headers_kept: string[]
}

export interface SetHeadersToSplitResponse {
  count_headers_to_split: number
}

export interface FileData {
  rows: Record<string, unknown>[]
  headers: string[]
  filename: string
  headersToKeep: string[] | null
  headersToSplit: string[] | null
  baseName: string | null
}
