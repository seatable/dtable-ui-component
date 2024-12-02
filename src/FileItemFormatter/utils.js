import { getImageThumbnailUrl } from '../utils/url';

const FILEEXT_ICON_MAP = {
  // text file
  md: 'txt.png',
  txt: 'txt.png',

  // pdf file
  pdf: 'pdf.png',

  // document file
  doc: 'word.png',
  docx: 'word.png',
  odt: 'word.png',
  fodt: 'word.png',

  ppt: 'ppt.png',
  pptx: 'ppt.png',
  odp: 'ppt.png',
  fodp: 'ppt.png',

  xls: 'excel.png',
  xlsx: 'excel.png',
  ods: 'excel.png',
  fods: 'excel.png',

  // video
  mp4: 'video.png',
  ogv: 'video.png',
  webm: 'video.png',
  mov: 'video.png',
  flv: 'video.png',
  wmv: 'video.png',
  rmvb: 'video.png',

  // music file
  mp3: 'music.png',
  oga: 'music.png',
  ogg: 'music.png',
  flac: 'music.png',
  aac: 'music.png',
  ac3: 'music.png',
  wma: 'music.png',

  // image file
  jpg: 'pic.png',
  jpeg: 'pic.png',
  png: 'pic.png',
  svg: 'pic.png',
  gif: 'pic.png',
  bmp: 'pic.png',
  ico: 'pic.png',

  // folder dir
  folder: 'folder-192.png',

  // default
  default: 'file.png',
};

export const getFileThumbnailInfo = (fileItem) => {
  let fileIconUrl;
  let isImage;
  if (!fileItem.name) {
    fileIconUrl = FILEEXT_ICON_MAP['default'];
    isImage = false;
  } else {
    isImage = imageCheck(fileItem.name);
    if (isImage) {
      fileIconUrl = getImageThumbnailUrl(fileItem.url);
    } else {
      fileIconUrl = require('./' + getFileIconUrl(fileItem.name, fileItem.type));
    }
  }
  return { fileIconUrl, isImage };
};

export const getFileIconUrl = (filename, direntType) => {
  if (typeof direntType === 'string' && direntType === 'dir') {
    return 'assets/folder/' + FILEEXT_ICON_MAP['folder'];
  }

  const identifierIndex = typeof filename === 'string' && filename.lastIndexOf('.');
  if (identifierIndex === -1) {
    return 'assets/file/192/' + FILEEXT_ICON_MAP['default'];
  }

  const file_ext = (typeof filename === 'string' && filename.slice(identifierIndex + 1).toLowerCase()) || 'default';
  const iconUrl = FILEEXT_ICON_MAP[file_ext] ? 'assets/file/192/' + FILEEXT_ICON_MAP[file_ext] : 'assets/file/192/' + FILEEXT_ICON_MAP['default'];
  return iconUrl;
};

export const imageCheck = filename => {
  // no file ext
  if (!filename || typeof filename !== 'string') return false;
  if (filename.lastIndexOf('.') === -1) {
    return false;
  }
  const file_ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
  const image_exts = ['gif', 'jpeg', 'jpg', 'png', 'ico', 'bmp', 'tif', 'tiff', 'webp'];
  return image_exts.includes(file_ext);
};
