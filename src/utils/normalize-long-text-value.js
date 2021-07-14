const hrefReg = /\[.+\]\(\S+\)|<img src=(\S+).+\/>|!\[\]\(\S+\)|<\S+>/g,
  imageReg1 = /^<img src="(\S+)" .+\/>/,
  imageReg2 = /^!\[\]\((\S+)\)/,
  linkReg1 = /^\[.+\]\(\S+\)/,
  linkReg2 = /^<\S+>$/;

const getLinks = (hrefList) => {
  const hrefObj = {
    links: [],
    images: []
  };
  hrefList.forEach((href) => {
    if (href.search(linkReg1) >= 0 || href.search(linkReg2) >= 0) {
      hrefObj.links.push(href);
    } else {
      let imageSrcList = href.match(imageReg1);
      let imageSrcList1 = href.match(imageReg2);
      if (imageSrcList) {
        hrefObj.images.push(imageSrcList[1]);
      } else if (imageSrcList1) {
        hrefObj.images.push(imageSrcList1[1]);
      }
    }
  });
  return hrefObj;
};

const getPreviewContent = (markdownContent) => {
  let preview = '';
  let newMarkdownContent = markdownContent.replace(hrefReg, '');
  for (let index = 0; index < newMarkdownContent.length; index++) {
    if (newMarkdownContent[index] === '#') {
      continue;
    } else if (newMarkdownContent[index] === '\n') {
      preview += ' ';
    } else {
      preview += newMarkdownContent[index];
    }
    if (preview.length === 30) {
      break;
    }
  }

  const hrefList = markdownContent.match(hrefReg);
  if (hrefList) {
    const { images, links } = getLinks(hrefList);
    return { preview, images, links };
  }
  return { preview, images: [], links: [] };
};


export default getPreviewContent;
