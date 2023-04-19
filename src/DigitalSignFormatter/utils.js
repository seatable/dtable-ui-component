export const getDigitalSignImageUrl = (cellValue, config) => {
  if (!cellValue) return '';
  const url = (cellValue && cellValue.sign_image_url) || '';
  if (!url) return '';
  if (!config) return url;
  const { server, workspaceID, dtableUuid } = config || {};
  if (server && (workspaceID || workspaceID === 0) && dtableUuid) {
    return `${server}/workspace/${workspaceID}/asset/${dtableUuid}${url}`;
  }
  return url;
};

export const isValidDigitalSignImageValue = (cellValue) => {
  if (!cellValue) return false;
  const digitalSignImage = cellValue && cellValue.sign_image_url;
  if (!digitalSignImage) return false;
  return true;
};
