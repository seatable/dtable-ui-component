export const isInternalImg = (url, server) => {
  if(!url) return;
  const currentServer = server || (window.dtable && window.dtable.server);
  return url.indexOf(currentServer) > -1;
};

export const checkSVGImage = (url) => {
  if (!url) return false;
  return url.substr(-4).toLowerCase() === '.svg';
};
