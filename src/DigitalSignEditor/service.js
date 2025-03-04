import DigitalSignUtils from './utils';
import { DIGITAL_SIGNS_FOLDER } from './constants';

class DigitalService {

  constructor(props) {
    this.init(props);
  }

  init(props) {
    this.uploadFile = props.uploadFile;
    this.username = props.username;
  }

  uploadSignImage(signBlob, { successCallback, failedCallback }) {
    if (!this.uploadFile) return;
    const name = `${this.username}-${Date.now().toString()}.png`;
    const file = new File([signBlob], name, { type: 'image/png' });
    this.uploadFile(file, DIGITAL_SIGNS_FOLDER).then(data => {
      const signature = DigitalSignUtils.getUpdatedSign({
        username: this.username,
        sign_image_url: data.url,
      });
      successCallback && successCallback(signature);
    }).catch(error => {
      failedCallback && failedCallback(error);
    });
  }
}

export default DigitalService;
