export const isTargetUrl = (target, url) => {
  if (!url || typeof url !== 'string') return false;
  return target && url ? url.indexOf(target) > -1 : false;
};

export const isInternalImg = (url, server) => {
  if (!url || typeof url !== 'string') return false;
  const currentServer = server || (window.dtable && window.dtable.server);
  return url.indexOf(currentServer) > -1;
};

export const isCustomAssetUrl = (url) => {
  return isTargetUrl('custom-asset://', url);
};

export const checkSVGImage = (url) => {
  if (!url || typeof url !== 'string') return false;
  const isSVGImage = url.substring(url.lastIndexOf('.')).toLowerCase() === '.svg';
  return isSVGImage;
};

export const isDigitalSignsUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
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
  if (!partUrl || typeof partUrl !== 'string') return '';
  return `${server}/thumbnail/workspace/${workspaceID}/asset/${dtableUuid}${partUrl}?size=${size}`;
};

export const generateCurrentBaseImageUrl = ({ server, workspaceID, dtableUuid, partUrl }) => {
  if (!partUrl || typeof partUrl !== 'string') return '';
  return `${server}/workspace/${workspaceID}/asset/${dtableUuid}${partUrl}`;
};

export const getImageThumbnailUrl = (url, { server, dtableUuid, workspaceID, size = 256 } = {}) => {
  if (!url || typeof url !== 'string') return '';

  if (server && dtableUuid && isCustomAssetUrl(url)) {
    const assetUuid = url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return server + '/dtable/' + dtableUuid + '/custom-asset-thumbnail/' + assetUuid + '?size=' + size;
  }

  if (server && workspaceID && dtableUuid && isDigitalSignsUrl(url)) {
    return generateCurrentBaseImageThumbnailUrl({
      server, workspaceID, dtableUuid, size, partUrl: url,
    });
  }

  if (checkSVGImage(url) || !isInternalImg(url)) {
    return url;
  }

  return url.replace('/workspace', '/thumbnail/workspace') + '?size=' + size;
};
