import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getDigitalSignImageUrl } from 'dtable-utils';

dayjs.extend(utc);

class DigitalSignUtils {

  static getSignImageUrl(sign) {
    return getDigitalSignImageUrl(sign);
  }

  static getUpdatedSign({ username, sign_image_url }) {
    const time = dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    return {
      username,
      sign_image_url,
      sign_time: time,
    };
  }
}

export default DigitalSignUtils;
