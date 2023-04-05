export const IMAGE_FILES_MIMES: string[] = [
  'image/png',
  'image/jpeg',
  'image/jp2', // .jpeg200
  'image/jpm', // .jpeg200
  'image/gif',
  'image/webp'
]

export const VIDEO_FILES_MIMES: string[] = [
  'video/x-msvideo', // .avi
  'video/mpeg',
  'video/mp4',
  'video/ogg', // .ogv
  'video/mp2t', // .ts
  'video/webm' // .webm
]

export const AUDIO_FILES_MIMES: string[] = [
  'audio/aac',
  'audio/mp3',
  'audio/mpeg', // .mp3
  'audio/ogg',
  'audio/wav',
  'audio/webm' // .weba
]

export enum FileAcceptType {
  'gif' = 'image/gif',
  'jpg' = 'image/jpeg',
  'jpeg' = 'image/jpeg',
  'png' = 'image/png',
  'webp' = 'image/webp',

  'avi' = 'video/x-msvideo',
  'mpeg' = 'video/mpeg',
  'webm' = 'video/webm',
  'mp4' = 'video/mp4',

  'mp3' = 'audio/mpeg',
  'wav' = 'audio/wav',
  'weba' = 'audio/webm'
}

export const PPT_FILES_MIMES: string[] = [
  'application/vnd.ms-powerpoint', // .pot .ppa .pps .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', //.pptx
  'application/vnd.openxmlformats-officedocument.presentationml.template', //.potx
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow', //.ppsx
  'application/vnd.ms-powerpoint.addin.macroEnabled.12', //.ppam
  'application/vnd.ms-powerpoint.presentation.macroEnabled.12', //.pptm
  'application/vnd.ms-powerpoint.template.macroEnabled.12', //.potm
  'application/vnd.ms-powerpoint.slideshow.macroEnabled.12' //.ppsm
]

export const DOC_FILES_MIMES: string[] = [
  'application/msword ', // .doc .dot
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //.docx
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template', //.dotx
  'application/vnd.ms-word.document.macroEnabled.12', //.docm
  'application/vnd.ms-word.template.macroEnabled.12' //.dotm
]

export const PDF_FILES_MIMES: string[] = ['application/pdf']
