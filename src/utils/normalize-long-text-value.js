import { Node } from 'slate';

const getPreviewContent = (content) => {
  let previewContent = {previewText: '', images: [], links: [], checklist: {total: 0, completed: 0}};
  getPreviewInfo(content, previewContent);
  getPreviewText(content, previewContent);
  return previewContent;
};

const getPreviewInfo = (nodes, previewContent) => {
  let nodeIndex = 0;
  while(nodes && nodeIndex <= nodes.length - 1) {
    const currentNode = nodes[nodeIndex];
    if (currentNode.type === 'link') {
      previewContent.links.push(currentNode.data.href);
    } else if (currentNode.type === 'image') {
      previewContent.images.push(currentNode.data.src);
    } else if (currentNode.type === 'list_item' && currentNode.data) {
      const data = currentNode.data;
      if (data.hasOwnProperty('checked')) {
        previewContent.checklist.total += 1;
        if (data.checked) {
          previewContent.checklist.completed++;
        }
      }
      getPreviewInfo(currentNode.children, previewContent);
    } else {
      getPreviewInfo(currentNode.children, previewContent);
    }
    nodeIndex++;
  }
};

const getTextOfNode = (node) => {
  let text = '';
  for(let index = 0; index < node.children.length; index++) {
    const currentNode = node.children[index];
    const data = currentNode.data;
    const type = currentNode.type;
    if (type === 'link') {
      text += '';
    } else if (type === 'list_item') {
      if (data && data.hasOwnProperty('checked')) {
        text += '';
      } else {
        text += Node.text(currentNode) + ' ';
      }
    } else {
      if (currentNode.hasOwnProperty('text')) {
        text += currentNode.text;
      } else {
        text += Node.text(currentNode) + ' ';
      }
    }    
  }
  return text;
};

const getPreviewText = (content, previewContent) => {
  let previewText = '';
  for(let index = 0; index < content.length; index++) {
    previewText += getTextOfNode(content[index]) + ' ';
    let textLength = previewText.length;
    if (textLength >= 150) {
      break;
    }
  }
  previewContent.previewText = previewText;
};

export default getPreviewContent;
