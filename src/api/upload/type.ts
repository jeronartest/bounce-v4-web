export type IUploaderBody = {
  file: File
}

export type IFileType = {
  fileName: string
  fileSize: number
  fileThumbnailUrl: string
  fileType: string
  fileUrl: string
  id?: number
}

export type IAvatarLinkType = {
  avatar: string
  link?: string
  name: string
  id?: number | string
}
