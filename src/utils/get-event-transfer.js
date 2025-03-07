const HTML = 'text/html';
const TEXT = 'text/plain';
// const FILES = 'files';

function getType(transfer, type) {
  if (!transfer.types || !transfer.types.length) {
    // COMPAT: In IE 11, there is no `types` field but `getData('Text')`
    // is supported`. (2017/06/23)
    return type === TEXT ? transfer.getData('Text') || null : null;
  }

  return transfer.getData(type);
}

function getFiles(transfer) {
  let files;
  try {
    // Get and normalize files if they exist.
    if (transfer.items && transfer.items.length) {
      files = Array.from(transfer.items)
        .map(item => (item.kind === 'file' ? item.getAsFile() : null))
        .filter(exists => exists);
    } else if (transfer.files && transfer.files.length) {
      files = Array.from(transfer.files);
    }
  } catch (err) {
    if (transfer.files && transfer.files.length) {
      files = Array.from(transfer.files);
    }
  }
  return files;
}

function getEventTransfer(event) {
  let html;
  let text;
  let files;
  if (window.isMobile) {
    if (window.dtableTransfer) {
      text = window.dtableTransfer['TEXT'];
    }
  } else {
    const transfer = event.dataTransfer || event.clipboardData;
    html = getType(transfer, HTML);
    text = getType(transfer, TEXT);
    files = getFiles(transfer);
  }

  // paste html
  if (html) {
    return { html, text, type: 'html' };
  }

  // paste local picture or other files here
  if (files && files.length) {
    return { 'files': files, type: 'files' };
  }

  // paste text
  if (text) {
    return { text, type: 'text' };
  }
}

export default getEventTransfer;
