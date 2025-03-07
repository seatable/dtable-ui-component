import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { getLocale } from '../../../lang';

import './index.css';

class ImageLink extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imageLink: '',
      isShowErrorMessage: false
    };
  }

  saveImageLink = () => {
    let { imageLink } = this.state;
    let _this = this;
    let image = new Image();
    image.onload = function () { // Determine if the picture url is correct
      if (image.fileSize > 0 || (image.width > 0 && image.height > 0)) {
        _this.props.saveImageLink(imageLink);
      }
    };
    image.onerror = function () {
      _this.setState({ isShowErrorMessage: true });
    };
    image.src = imageLink;
  };

  handleChange = (event) => {
    let value = event.target.value;

    this.setState({
      imageLink: value
    });
  };

  imageLinkPaste = (e) => {
    e.stopPropagation();
  };

  onKeyDown = (e) => {
    e.stopPropagation();
  };

  render() {
    const { isShowErrorMessage } = this.state;
    return (
      <div className="dtable-ui-image-link" onKeyDown={this.onKeyDown}>
        <div className="dtable-ui-image-link-container">
          <Input className="dtable-ui-image-link-input" placeholder={getLocale('Enter_a_URL')} onPaste={this.imageLinkPaste} onChange={this.handleChange} />
          <span className="dtable-ui-image-link-icon dtable-font dtable-icon-url" onClick={this.saveImageLink} ></span>
        </div>
        {isShowErrorMessage &&
          <div className="dtable-ui-image-link-error-message">{getLocale('Please_enter_the_correct_image_address')}</div>
        }
      </div>
    );
  }
}

ImageLink.propTypes = {
  saveImageLink: PropTypes.func.isRequired,
};

export default ImageLink;
