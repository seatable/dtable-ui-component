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

export const parseURL = (url) => {
  var a = document.createElement("a");
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(":", ""),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      var ret = {},
        seg = a.search.replace(/^\?/, "").split("&"),
        len = seg.length,
        i = 0,
        s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split("=");
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
    hash: a.hash.replace("#", ""),
    path: a.pathname.replace(/^([^\/])/, "/$1"),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1],
    segments: a.pathname.replace(/^\//, "").split("/"),
  };
}
