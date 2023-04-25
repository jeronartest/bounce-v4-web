import { ReactComponent as PdfSVG } from 'assets/imgs/icon/pdf_2.svg'
import { ReactComponent as AudioSVG } from 'assets/imgs/icon/audio.svg'
import { ReactComponent as VideoSVG } from 'assets/imgs/icon/video.svg'
import { ReactComponent as PptSVG } from 'assets/imgs/icon/ppt_2.svg'
import { ReactComponent as DocSVG } from 'assets/imgs/icon/doc.svg'
import { ReactComponent as DefaultFileSVG } from 'assets/imgs/icon/default_file_2.svg'
import {
  AUDIO_FILES_MIMES,
  DOC_FILES_MIMES,
  IMAGE_FILES_MIMES,
  PDF_FILES_MIMES,
  PPT_FILES_MIMES,
  VIDEO_FILES_MIMES
} from 'bounceComponents/common/Uploader/mimeTypes'

export interface FileIconProps {
  fileType?: string
  thumbnailUrl?: string
  fileUrl?: string
}

const FileIcon = ({ fileType, thumbnailUrl, fileUrl }: FileIconProps) => {
  if (!fileType) {
    return <DefaultFileSVG />
  }

  if (PDF_FILES_MIMES.includes(fileType)) {
    return <PdfSVG />
  }

  if (AUDIO_FILES_MIMES.includes(fileType)) {
    return <AudioSVG />
  }

  if (VIDEO_FILES_MIMES.includes(fileType)) {
    return <VideoSVG />
  }

  if (PPT_FILES_MIMES.includes(fileType)) {
    return <PptSVG />
  }

  if (DOC_FILES_MIMES.includes(fileType)) {
    return <DocSVG />
  }

  if (IMAGE_FILES_MIMES.includes(fileType)) {
    return (
      <picture>
        <img src={thumbnailUrl || fileUrl} width={52} height={52} style={{ borderRadius: 10, objectFit: 'contain' }} />
      </picture>
    )
  }

  return <DefaultFileSVG />
}
export default FileIcon
