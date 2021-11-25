const hrefReg = /\[.+\]\(\S+\)|<img( width=[\\|/]?"(\d)+[\\|/|]?")? src="(\S+)" .?\/>|!\[\]\(\S+\)|!\[\]\((\S+)\)|<\S+>/g;
const imageReg1 = /^<img( width=[\\|/]?"(\d)+[\\|/|]?")? src="(\S+)" .?\/>/;
const imageReg2 = /^!\[\]\((\S+)\)/;
const linkReg1 = /^\[.+\]\(\S+\)/;
const linkReg2 = /^<\S+>$/;

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
        hrefObj.images.push(imageSrcList[3]);
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
    if (preview.length === 150) {
      break;
    }
  }
  const hrefList = markdownContent.match(hrefReg);
  if (hrefList) {
    const { images, links } = getLinks(hrefList);
    return { preview, images, links };
  }
  return { preview, images: [], links: [], text: markdownContent };
};

export default getPreviewContent;
