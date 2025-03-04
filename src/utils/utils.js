import { ARRAY_FORMAT_COLUMNS } from '../constants';
import { isInternalURL, imageCheck } from './url';

export const debounce = (fn, wait) => {
  let timeout = null;
  return function () {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
  };
};

export const throttle = (func, delay) => {
  let timer = null;
  let startTime = Date.now();
  return function () {
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

export const isMobile = (typeof (window) !== 'undefined') && (window.innerWidth < 768 ||
  navigator.userAgent.toLowerCase().match(/(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null);

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

export const downloadFiles = (downloadUrlList, config) => {
  const downloadFrame = document.getElementById('dtableUiComponentDownloadFrame');
  if (downloadFrame != null) {
    document.body.removeChild(downloadFrame);
  }
  downloadUrlList.forEach((url, index) => {
    if (!isInternalURL(url, config) && imageCheck(url.replace('?dl=1', ''))) {
      window.open(url);
    } else {
      const path = url;
      let timer1 = setTimeout(function (path) {
        return function () {
          let iframe = document.createElement('iframe');
          iframe.setAttribute('id', 'dtableUiComponentDownloadFrame');
          iframe.style.display = 'none';
          iframe.src = path;
          document.body.appendChild(iframe);
          let timer2 = setTimeout(function () {
            iframe.remove();
            clearTimeout(timer2);
          }, 5000);
          clearTimeout(timer1);
        };
      }(path), 1000 * index);
    }
  });
};

export const getEventClassName = (e) => {
  // svg mouseEvent event.target.className is an object
  if (!e || !e.target) return '';
  return e.target.getAttribute('class') || '';
};

export const getTrimmedString = (value) => {
  return (typeof value === 'string') ? value.trim() : '';
};

export const isFunction = (functionToCheck) => {
  const getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

export const isValidCellValue = (value) => {
  if (value === undefined) return false;
  if (value === null) return false;
  if (value === '') return false;
  if (JSON.stringify(value) === '{}') return false;
  if (JSON.stringify(value) === '[]') return false;
  return true;
};

export const isValidUrl = (url) => {
  const reg = /^(([-a-zA-Z0-9+.]+):\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;

  return reg.test(url);
};

export const openUrlLink = (url) => {
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.click();
  document.body.removeChild(a);
};

export const getErrorMsg = (error) => {
  let errorMsg = '';
  if (error.response) {
    if (error.response.status === 403) {
      errorMsg = 'Permission_denied';
    } else if (error.response.data && error.response.data['error_msg']) {
      errorMsg = error.response.data['error_msg'];
    } else if (error.response.data && error.response.data['error_message']) {
      errorMsg = error.response.data['error_message'];
    } else {
      errorMsg = 'Error';
    }
  } else {
    if (typeof error === 'object' && error.name) {
      errorMsg = error.name;
    } else {
      errorMsg = 'Please_check_the_network';
    }
    // eslint-disable-next-line
    console.log(error);
  }
  return errorMsg;
};

export function isArrayFormatColumn(columnType) {
  return ARRAY_FORMAT_COLUMNS.includes(columnType);
}

export const getFormulaArrayValue = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => {
      if (Object.prototype.toString.call(item) !== '[object Object]') {
        return item;
      }
      if (!Object.prototype.hasOwnProperty.call(item, 'display_value')) return item;
      const { display_value } = item;
      if (!Array.isArray(display_value) || display_value.length === 0) return display_value;
      return display_value.map(i => {
        if (Object.prototype.toString.call(i) === '[object Object]') {
          if (!Object.prototype.hasOwnProperty.call(i, 'display_value')) return i;
          const { display_value } = i;
          return display_value;
        }
        return i;
      });
    })
    .filter(item => isValidCellValue(item));
};
