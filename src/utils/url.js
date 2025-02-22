import { FILEEXT_ICON_MAP, FILEEXT_ICON_URL_MAP } from '../constants/file';

export const isTargetUrl = (target, url) => {
  if (!url || typeof url !== 'string') return false;
  return target && url ? url.indexOf(target) > -1 : false;
};

export const isBase64 = (url) => {
  if (!url || typeof url !== 'string') return false;
  const target = 'data:image/png;base64';
  return url ? url.startsWith(target) : false;
};

export const isInternalImg = (url, server) => {
  if (!url || typeof url !== 'string') return false;
  const currentServer = server || (window?.dtable && window.dtable.server);
  return url.indexOf(currentServer) > -1;
};

export const isCustomAssetUrl = (url) => {
  return isTargetUrl('custom-asset://', url);
};

export const checkImgExists = (url) => {
  return new Promise(function (resolve, reject) {
    let image = new Image();
    image.src = url;
    image.onload = function (res) {
      resolve(res);
    };
    image.onerror = function (err) {
      reject(err);
    };
  });
};

export const checkSVGImage = (url) => {
  if (!url || typeof url !== 'string') return false;
  const isSVGImage = url.substring(url.lastIndexOf('.')).toLowerCase() === '.svg';
  return isSVGImage;
};

export const isAIUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return isTargetUrl('/ai/asset/', url) && url.includes('http');
};

export const isDigitalSignsUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  if (isAIUrl(url)) return true;
  return isTargetUrl('/digital-signs/', url) && !url.includes('http');
};

export const needUseThumbnailImage = (url) => {
  if (!url || typeof url !== 'string' || url.lastIndexOf('.') === -1) {
    return false;
  }
  const image_suffix = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
  const suffix = ['bmp', 'tif', 'tiff'];
  return suffix.includes(image_suffix);
};

export const generateCurrentBaseImageThumbnailUrl = ({ server, workspaceID, dtableUuid, partUrl, size }) => {
  const validServer = server || (window?.dtable && window.dtable.server) || '';
  if (!partUrl || typeof partUrl !== 'string') return '';
  let url = `${validServer}/thumbnail/workspace/${workspaceID}/asset/${dtableUuid}${partUrl}`;
  if (url.indexOf('?') > -1) return `${url}&size=${size}`;
  return `${url}?size=${size}`;
};

export const generateCurrentBaseImageUrl = ({ server, workspaceID, dtableUuid, partUrl }) => {
  if (!partUrl || typeof partUrl !== 'string') return '';
  if (partUrl.startsWith('http')) return partUrl;
  const validServer = server || (window?.dtable && window.dtable.server) || '';
  return `${validServer}/workspace/${workspaceID}/asset/${dtableUuid}${partUrl}`;
};

export const getImageThumbnailUrl = (url, { server, dtableUuid, workspaceID, size = 256 } = {}) => {
  if (!url || typeof url !== 'string') return '';

  if (isAIUrl(url) || checkSVGImage(url) || !isInternalImg(url) || isBase64(url)) return url;

  if (server && dtableUuid && isCustomAssetUrl(url)) {
    const assetUuid = url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return server + '/dtable/' + dtableUuid + '/custom-asset-thumbnail/' + assetUuid + '?size=' + size;
  }

  if (server && workspaceID && dtableUuid && isDigitalSignsUrl(url)) {
    return generateCurrentBaseImageThumbnailUrl({
      server, workspaceID, dtableUuid, size, partUrl: url,
    });
  }

  if (url.includes('/thumbnail/workspace')) return url;

  return url.replace('/workspace', '/thumbnail/workspace') + '?size=' + size;
};

export const getFileName = (url) => {
  if (!url) return null;
  let lastIndex = url.lastIndexOf('/');
  return url.slice(lastIndex + 1);
};

export const imageCheck = (filename) => {
  // no file ext
  if (!filename || typeof filename !== 'string') return false;
  if (filename.lastIndexOf('.') === -1) {
    return false;
  }
  const file_ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
  const image_exts = ['gif', 'jpeg', 'jpg', 'png', 'ico', 'bmp', 'tif', 'tiff', 'webp'];
  return image_exts.includes(file_ext);
};

export const isInternalURL = (url, { server = '' } = {}) => {
  if (!url || typeof url !== 'string') return false;
  return server && url.indexOf(server) > -1;
};

export const getValidFileImageUrls = (files) => {
  if (!Array.isArray(files)) return [];
  return files.map(file => {
    if (typeof file !== 'object') return null;

    const { url, name } = file;
    if (!url || url.indexOf('/asset') < 0) return null;
    return imageCheck(name) ? url : null;
  }).filter(Boolean);
};

export const getFileIconUrl = (filename, direntType) => {
  const defaultIcon = FILEEXT_ICON_MAP['default'];
  const defaultIconUrl = FILEEXT_ICON_URL_MAP[defaultIcon];
  if (typeof direntType === 'string' && direntType === 'dir') {
    const folder = FILEEXT_ICON_MAP['folder'];
    return FILEEXT_ICON_URL_MAP[folder]['192'];
  }

  const identifierIndex = typeof filename === 'string' && filename.lastIndexOf('.');
  if (identifierIndex === -1) return defaultIconUrl['192'];

  const fileExt = (typeof filename === 'string' && filename.slice(identifierIndex + 1).toLowerCase()) || 'default';
  const fileIcon = FILEEXT_ICON_MAP[fileExt];
  if (fileIcon) {
    const iconUrl = FILEEXT_ICON_URL_MAP[fileIcon];
    return iconUrl['192'];
  }
  return defaultIconUrl['192'];
};

export const getFileThumbnailInfo = (file, { server } = {}) => {
  const defaultIcon = FILEEXT_ICON_MAP['default'];
  const defaultIconUrl = FILEEXT_ICON_URL_MAP[defaultIcon];
  if (!file || !file.name) return { isImage: false, fileIconUrl: defaultIconUrl['192'] };
  const isImage = imageCheck(file.name);
  if (isImage) return { isImage, fileIconUrl: getImageThumbnailUrl(file.url, { server }) };
  const iconUrl = getFileIconUrl(file.name, file.type);
  return { fileIconUrl: iconUrl, isImage: false };
};
