import React from 'react';
import PropTypes from 'prop-types';
import ImagePreviewerLightbox from '../../ImagePreviewerLightbox';
import ImagePreviewer from './image-preview';
import DTableCommonAddTool from '../../DTableCommonAddTool';
import { downloadFile } from '../../utils/utils';
import { FILE_EDITOR_STATUS, isMobile } from '../../constants';
import { getLocale } from '../../lang';

import './index.css';

class ImagesPreviewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowLargeImage: false,
      largeImageIndex: '',
      enterImageItemIndex: -1
    };
  }

  componentDidMount() {
    if (isMobile) {
      window.history.pushState(null, null, '#');
      window.addEventListener('popstate', this.handleHistoryBack, false);
    }
  }

  componentWillUnmount() {
    if (isMobile) {
      window.removeEventListener('popstate', this.handleHistoryBack, false);
    }
  }

  handleHistoryBack = (e) => {
    if (this.state.isShowLargeImage) {
      this.hideLargeImage();
    } else if (this.props.closeEditor) {
      this.props.closeEditor();
    }
  };

  showLargeImage = (itemUrl) => {
    let { value } = this.props;
    this.setState({
      isShowLargeImage: true,
      largeImageIndex: value.indexOf(itemUrl)
    });
  };

  hideLargeImage = () => {
    this.setState({
      isShowLargeImage: false,
      largeImageIndex: ''
    });
  };

  moveNext = () => {
    let images = this.props.value;
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + 1) % images.length,
    }));
  };

  movePrev = () => {
    let images = this.props.value;
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + images.length - 1) % images.length,
    }));
  };

  setImageIndex = (index) => {
    this.setState({ largeImageIndex: index });
  };

  togglePreviewer = () => {
    this.props.togglePreviewer(FILE_EDITOR_STATUS.ADDITION);
    this.props.resetAdditionImage();
  };

  deleteImage = (index, type) => {
    this.props.deleteImage(index, type);
    const { value } = this.props;
    if (index > value.length - 2) {
      if (value.length - 2 < 0) {
        this.hideLargeImage();
      } else {
        this.setState({ largeImageIndex: 0 });
      }
    }
  };

  downloadImage = (imageItemUrl) => {
    let rotateIndex = imageItemUrl.indexOf('?a=');
    if (rotateIndex > -1) {
      imageItemUrl = imageItemUrl.slice(0, rotateIndex);
    }
    let imageUrlSuffix = imageItemUrl.indexOf('?dl=1');
    let downloadUrl = imageUrlSuffix !== -1 ? imageItemUrl : imageItemUrl + '?dl=1';
    downloadFile(downloadUrl);
  };

  setImageItemIndex = (index) => {
    this.setState({ enterImageItemIndex: index });
  };

  render() {
    let { value } = this.props;
    return (
      <div className="dtable-ui-image-previewer-container">
        <div className={`dtable-ui-image-previewer-wrapper ${(value.length === 0 && isMobile) ? 'd-none' : ''}`}>
          <div className="dtable-ui-image-previewer-content">
            {value.length > 0 && value.map((imageItemUrl, index) => {
              return (
                <ImagePreviewer
                  key={imageItemUrl + index}
                  imageItemUrl={imageItemUrl}
                  value={value}
                  itemIndex={index}
                  deleteImage={this.props.deleteImage}
                  showLargeImage={this.showLargeImage}
                  downloadImage={this.downloadImage}
                  enterImageItemIndex={this.state.enterImageItemIndex}
                  setImageItemIndex={this.setImageItemIndex}
                />
              );
            })}
          </div>
        </div>
        {this.state.isShowLargeImage && (
          <ImagePreviewerLightbox
            imageItems={value}
            imageIndex={this.state.largeImageIndex}
            closeImagePopup={this.hideLargeImage}
            moveToPrevImage={this.movePrev}
            moveToNextImage={this.moveNext}
            deleteImage={this.props.deleteImage ? this.deleteImage : null}
            downloadImage={this.downloadImage}
            onRotateImage={this.props.onRotateImage}
            setImageIndex={this.setImageIndex}
          />
        )}
        <DTableCommonAddTool callBack={this.togglePreviewer} footerName={getLocale('Add_images')} />
      </div>
    );
  }
}

ImagesPreviewer.propTypes = {
  value: PropTypes.array,
  togglePreviewer: PropTypes.func,
  deleteImage: PropTypes.func,
  resetAdditionImage: PropTypes.func,
  onRotateImage: PropTypes.func,
  closeEditor: PropTypes.func,
};

export default ImagesPreviewer;
