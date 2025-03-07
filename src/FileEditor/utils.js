import dayjs from 'dayjs';

export const getFileUploadTime = (file) => {
  return file.upload_time ? dayjs(file.upload_time).format('YYYY-MM-DD HH:mm') : '';
};

export const bytesToSize = (bytes) => {
  if (typeof(bytes) == 'undefined') return ' ';

  if (bytes < 0) return '--';
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  if (bytes === 0) return bytes + ' ' + sizes[0];

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)), 10);
  if (i === 0) return bytes + ' ' + sizes[i];
  return (bytes / (1000 ** i)).toFixed(1) + ' ' + sizes[i];
};
