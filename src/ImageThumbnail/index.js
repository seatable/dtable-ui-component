import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import classnames from 'classnames';
import DeleteTip from '../DeleteTip';
import { getImageThumbnailUrl, checkImgExists, checkSVGImage, getFileName } from '../utils/url';
import { getLocale } from '../lang';
import { isMobile } from '../constants';

import './index.css';

class ImageThumbnail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imageThumbnailUrl: '',
      showTip: false,
      isTooltipOpen: false,
    };
    this.ref = null;
    const { mediaUrl = '' } = props.config || {};
    this.imageLoadingFailedUrl = `${mediaUrl}img/image-loading-failed.png`;
  }

  componentDidMount() {
    this.getUrl(this.props.src);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.getUrl(nextProps.src);
    }
  }

  getUrl = (src) => {
    if (checkSVGImage(src)) {
      this.setState({ imageThumbnailUrl: src });
      return;
    }
    const imageThumbnailUrl = getImageThumbnailUrl(src);
    checkImgExists(imageThumbnailUrl).then(() => {
      this.setState({ imageThumbnailUrl });
    }).catch(() => {
      this.setState({ imageThumbnailUrl: this.imageLoadingFailedUrl });
    });
  };

  onClick = () => {
    this.props.onClick(this.props.index);
  };

  downloadImage = (e) => {
    e.stopPropagation();
    this.props.downloadImage(this.props.src);
  };

  deleteImage = () => {
    this.closeTip();
    this.props.deleteImage(this.props.index);
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

  render() {
    const { index, downloadImage, src, className, name } = this.props;
    const { imageThumbnailUrl } = this.state;
    return (
      <>
        <div className={classnames('dtable-ui-image-thumbnail', className)} onClick={this.onClick} ref={ref => this.ref = ref}>
          <img src={imageThumbnailUrl} id={`item-image-${index}`} alt="" />
          <div className="dtable-ui-image-icons-choice">
            {downloadImage &&
              <span className="image-icon" onClick={this.downloadImage}>
                <i aria-hidden="true" className="dtable-font dtable-icon-download"></i>
              </span>
            }
            <span className="image-icon" onClick={this.onClickDelete}>
              <i aria-hidden="true" className="dtable-font dtable-icon-fork-number"></i>
            </span>
          </div>
        </div>
        {this.state.showTip &&
          <DeleteTip
            position={this.position}
            toggle={this.closeTip}
            handleDelete={this.deleteImage}
            deleteTip={this.props.deleteTip || getLocale('Are_you_sure_you_want_to_delete_this_image')}
          />
        }
        {!isMobile && this.ref && (
          <Tooltip
            placement="bottom"
            isOpen={this.state.isTooltipOpen}
            toggle={this.toggle}
            target={this.ref}
            delay={{ show: 0, hide: 0 }}
            fade={false}
          >
            {name || getFileName(src)}
          </Tooltip>
        )}
      </>
    );
  }
}

ImageThumbnail.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  config: PropTypes.object,
  deleteTip: PropTypes.string,
  onClick: PropTypes.func,
  downloadImage: PropTypes.func,
  deleteImage: PropTypes.func.isRequired,
};

export default ImageThumbnail;
