
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const getDigitalSignImageUrl = (cellValue) => {
  return (cellValue && cellValue.sign_image_url) || '';
};
