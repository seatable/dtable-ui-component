const FILEEXT_ICON_MAP = {
  // text file
  md: "txt.png",
  txt: "txt.png",

  // pdf file
  pdf: "pdf.png",

  // document file
  doc: "word.png",
  docx: "word.png",
  odt: "word.png",
  fodt: "word.png",

  ppt: "ppt.png",
  pptx: "ppt.png",
  odp: "ppt.png",
  fodp: "ppt.png",

  xls: "excel.png",
  xlsx: "excel.png",
  ods: "excel.png",
  fods: "excel.png",

  // video
  mp4: "video.png",
  ogv: "video.png",
  webm: "video.png",
  mov: "video.png",
  flv: "video.png",
  wmv: "video.png",
  rmvb: "video.png",

  // music file
  mp3: "music.png",
  oga: "music.png",
  ogg: "music.png",
  flac: "music.png",
  aac: "music.png",
  ac3: "music.png",
  wma: "music.png",

  // image file
  jpg: "pic.png",
  jpeg: "pic.png",
  png: "pic.png",
  svg: "pic.png",
  gif: "pic.png",
  bmp: "pic.png",
  ico: "pic.png",

  // folder dir
  folder: "folder-192.png",

  // default
  default: "file.png",
};

export const getFileIconUrl = (filename, direntType) => {
  if (direntType === "dir") {
    let iconUrl = "assets/images/folder/" + FILEEXT_ICON_MAP["folder"];
    return iconUrl;
  }

  let iconUrl = "";
  if (filename.lastIndexOf(".") === -1) {
    iconUrl = "assets/images/file/192/" + FILEEXT_ICON_MAP["default"];
    return iconUrl;
  }

  let file_ext = filename.substr(filename.lastIndexOf(".") + 1).toLowerCase();

  if (FILEEXT_ICON_MAP[file_ext]) {
    iconUrl = "assets/images/file/192/" + FILEEXT_ICON_MAP[file_ext];
  } else {
    iconUrl = "assets/images/file/192/" + FILEEXT_ICON_MAP["default"];
  }

  return iconUrl;
};

export const getImageThumbnailUrl = (url, server) => {
  if (server && url.indexOf(server) > -1) {
    return url.replace("/workspace", "/thumbnail/workspace") + "?size=256";
  }
  return url;
};

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

