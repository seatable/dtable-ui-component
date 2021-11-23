export const isInternalImg = (url) => {
  if(!url) return;
  return url.indexOf(window.dtable.server) > -1;
};

export const checkSVGImage = (url) => {
  if (!url) return false;
  return url.substr(-4).toLowerCase() === '.svg';
};
