import { IMAGE_FILES_MIMES } from 'bounceComponents/common/Uploader/mimeTypes'

export const ellipseFileName = ({
  fileName,
  triggerCount,
  frontCount,
  endCount
}: {
  fileName?: string
  triggerCount: number
  frontCount: number
  endCount: number
}) => {
  if (!fileName) return ''

  if (fileName.length >= triggerCount) {
    return `${fileName.slice(0, frontCount)}...${fileName.slice(-endCount)}`
  } else {
    return fileName
  }
}

export const shouldFileTypeShowIcon = (fileType: string) => {
  if (IMAGE_FILES_MIMES.includes(fileType)) {
    return false
  } else {
    return true
  }
}
