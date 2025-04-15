import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import DeleteTip from '../../../DeleteTip';
import { getImageThumbnailUrl, checkImgExists, checkSVGImage, getFileName } from '../../../utils/url';
import { FILE_EDITOR_STATUS, isMobile } from '../../../constants';
import { getLocale } from '../../../lang';

import './index.css';

class ImagePreviewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isTooltipOpen: false,
      imageThumbnailUrl: ''
    };
    this.canDownLoad = props.canDownLoad;
    const offsetWidth = document.body.offsetWidth;
    this.containerSize = offsetWidth < 767.8 ? ((offsetWidth - 55) / 2) + 'px' : ((offsetWidth - 80) / 3) + 'px';
    this.position = {};
    const { mediaUrl } = props.config || {};
    this.imageLoadingFailedUrl = `${mediaUrl}img/image-loading-failed.png`;
    this.ref = null;
  }

  componentDidMount() {
    let { imageItemUrl, config } = this.props;
    if (checkSVGImage(imageItemUrl)) {
      this.setState({ imageThumbnailUrl: imageItemUrl });
      return;
    }
    let imageThumbnailUrl = getImageThumbnailUrl(imageItemUrl, config);
    checkImgExists(imageThumbnailUrl).then(() => {
      this.setState({ imageThumbnailUrl: imageThumbnailUrl });
    }).catch(() => {
      this.setState({ imageThumbnailUrl: this.imageLoadingFailedUrl });
    });
  }

  showLargeImage = () => {
    let { imageItemUrl } = this.props;
    this.props.showLargeImage(imageItemUrl);
  };

  showImageToolbar = () => {
    let { itemIndex } = this.props;
    this.props.setImageItemIndex(itemIndex);
  };

  hideImageToolbar = () => {
    this.props.setImageItemIndex(-1);
  };

  downloadImage = (e) => {
    e.stopPropagation();
    this.props.downloadImage(this.props.imageItemUrl);
  };

  deleteImage = (e) => {
    e.stopPropagation();
    let { itemIndex } = this.props;
    this.props.deleteImage(itemIndex, FILE_EDITOR_STATUS.PREVIEWER);
  };

  onClickDelete = (e) => {
    e.stopPropagation();
    this.position = {
      top: e.clientY,
      left: e.clientX,
    };
    this.setState({ showTip: true });
  };

  closeTip = () => {
    this.setState({ showTip: false });
  };

  toggle = () => {
    this.setState({ isTooltipOpen: !this.state.isTooltipOpen });
  };

  renderImageIcons = () => {
    return (
      <div className="dtable-ui-image-icons-choice">
        {this.props.downloadImage && this.canDownLoad && (
          <span className="image-icon" onClick={this.downloadImage}>
            <i aria-hidden="true" className="dtable-font dtable-icon-download"></i>
          </span>
        )}
        {this.props.deleteImage && (
          <span className="image-icon" onClick={this.onClickDelete}>
            <i aria-hidden="true" className="dtable-font dtable-icon-fork-number"></i>
          </span>
        )}
      </div>
    );
  };

  render() {
    const { enterImageItemIndex, itemIndex, imageItemUrl } = this.props;

    return (
      <Fragment>
        <div
          style={isMobile ? { width: this.containerSize, height: this.containerSize } : {}}
          onClick={this.showLargeImage}
          className="dtable-ui-image-previewer-box"
          onMouseEnter={this.showImageToolbar}
          onMouseLeave={this.hideImageToolbar}
          ref={ref => this.ref = ref}
        >
          <img src={this.state.imageThumbnailUrl} alt="" />
          {enterImageItemIndex === itemIndex &&
            this.renderImageIcons()
          }
        </div>
        {!isMobile && enterImageItemIndex === itemIndex &&
          <Tooltip
            placement='bottom'
            isOpen={this.state.isTooltipOpen}
            toggle={this.toggle}
            target={this.ref}
            delay={{ show: 0, hide: 0 }}
            fade={false}
          >
            {getFileName(imageItemUrl)}
          </Tooltip>
        }
        {this.state.showTip &&
          <DeleteTip
            position={this.position}
            toggle={this.closeTip}
            handleDelete={this.deleteImage}
            deleteTip={getLocale('Are_you_sure_you_want_to_delete_this_image')}
          />
        }
      </Fragment>
    );
  }
}

ImagePreviewer.propTypes = {
  enterImageItemIndex: PropTypes.number,
  imageItemUrl: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  itemIndex: PropTypes.number.isRequired,
  deleteImage: PropTypes.func.isRequired,
  downloadImage: PropTypes.func.isRequired,
  showLargeImage: PropTypes.func.isRequired,
  setImageItemIndex: PropTypes.func.isRequired,
};

export default ImagePreviewer;
