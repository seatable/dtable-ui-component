export const getImageThumbnailUrl = (url, server) => {
  if (server && url.indexOf(server) > -1) {
    return url.replace('/workspace', '/thumbnail/workspace') + '?size=256';
  }
  return url;
};
