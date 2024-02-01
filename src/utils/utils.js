export const debounce = (fn, wait) => {
  let timeout = null;
  return function() {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
  };
};

export const throttle = (func, delay) => {
  let timer = null;
  let startTime = Date.now();
  return function() {
    let curTime = Date.now();
    let remaining = delay - (curTime - startTime);
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    if (remaining <= 0) {
      func.apply(context, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(func, remaining);
    }
  };
};

export const isMac = () => {
  const platform = navigator.platform;
  // eslint-disable-next-line eqeqeq
  return (platform == 'Mac68K') || (platform == 'MacPPC') || (platform == 'Macintosh') || (platform == 'MacIntel');
};

export const downloadFile = (downloadUrl) => {
  const downloadFrame = document.getElementById('dtableUiComponentDownloadFrame');
  if (downloadFrame != null) {
    document.body.removeChild(downloadFrame);
  }
  let iframe = document.createElement('iframe');
  iframe.setAttribute('id', 'dtableUiComponentDownloadFrame');
  iframe.style.display = 'none';
  iframe.src = downloadUrl;
  document.body.appendChild(iframe);
};

export const getEventClassName = (e) => {
  // svg mouseEvent event.target.className is an object
  if (!e || !e.target) return '';
  return e.target.getAttribute('class') || '';
};
