export enum adUnitTypesEnum {
  DISPLAY = 'display',
  POP = 'pop',
}

export const adCreativeTypes = {
  IMAGE: 'image',
  HTML: 'html',
  DIRECT: 'direct',
  VIDEO: 'video',
}

export enum adStatusesEnum {
  DRAFT,
  INACTIVE,
  ACTIVE,
  REJECTED,
}

export enum adUnitStatusesEnum {
  DRAFT,
  ACTIVE,
}

export const validHtmlTypes = [
  'application/octet-stream',
  'application/x-compressed',
  'application/x-zip',
  'application/x-zip-compressed',
  'application/zip',
  'multipart/x-zip',
]

export const fileTypes = {
  'image/gif': 'GIF',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
  'video/mp4': 'MP4',
}
