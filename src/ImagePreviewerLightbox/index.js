import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import ModalPortal from '../ModalPortal';
import Lightbox from '@seafile/react-image-lightbox';
import { checkSVGImage, isInternalImg } from './utils';

import '@seafile/react-image-lightbox/style.css';
import './index.css';

function ImagePreviewerLightbox(props) {
  const { imageItems, imageIndex, deleteImage, downloadImage, onRotateImage, readOnly,  } = props;
  const imageItemsLength = imageItems.length;
  const URL = imageItems[imageIndex];
  const imageTitle = URL ? decodeURI(URL.slice(URL.lastIndexOf('/') + 1)) : '';
  // svg image is vectorgraph and can't rotate, external image can't rotate
  const canRotateImage = onRotateImage && !readOnly && !checkSVGImage(URL) && isInternalImg(URL);
  const imageTitleEl = (
    <span className="d-flex">
      <span className="text-truncate">{imageTitle}</span>
      <span className="flex-shrink-0">({imageIndex + 1}/{imageItemsLength})</span>
    </span>
  );
  let toolbarButtons = [];
  if (!readOnly && deleteImage) {
    toolbarButtons.push(<button className='dtable-font dtable-icon-delete' onClick={() => {deleteImage(imageIndex, 'previewer');}}></button>);
  }
  if (downloadImage) {
    toolbarButtons.push(<button className='dtable-font dtable-icon-download' onClick={() => {downloadImage(URL);}}></button>);
  }
  return (
    <Fragment>
      <MediaQuery query="(min-width: 767.8px)">
        <Lightbox
          wrapperClassName="PC-image-previewer"
          imageTitle={imageTitleEl}
          toolbarButtons={toolbarButtons}
          mainSrc={imageItems[imageIndex]}
          nextSrc={imageItems[(imageIndex + 1) % imageItemsLength]}
          prevSrc={imageItems[(imageIndex + imageItemsLength - 1) % imageItemsLength]}
          onCloseRequest={props.closeImagePopup}
          onMovePrevRequest={props.moveToPrevImage}
          onMoveNextRequest={props.moveToNextImage}
          onRotateImage={canRotateImage ? (deg) => {onRotateImage(imageIndex, deg);} : null}
          imagePadding={70}
          reactModalStyle={{
            overlay: {
              zIndex: 1051
            }
          }}
        />
      </MediaQuery>
      <MediaQuery query="(max-width: 767.8px)">
        <Lightbox
          isDesktop={false}
          wrapperClassName="mobile-image-previewer dtable-ui-component"
          mainSrc={imageItems[imageIndex]}
          nextSrc={imageItems[(imageIndex + 1) % imageItemsLength]}
          prevSrc={imageItems[(imageIndex + imageItemsLength - 1) % imageItemsLength]}
          onCloseRequest={props.closeImagePopup}
          onMovePrevRequest={props.moveToPrevImage}
          onMoveNextRequest={props.moveToNextImage}
          imagePadding={0}
          animationDisabled={true}
          imageTitle={imageTitleEl}
          reactModalStyle={{
            overlay: {
              zIndex: 1051,
              backgroundColor: '#000',
            }
          }}
        />
        <ModalPortal>
          <div className="image-footer-choice mobile-image-footer-choice dtable-ui-component">
            <div className="image-footer-icon">
              <div className="d-flex">
                {canRotateImage &&
                  <span className="image-footer-choice-item mr-4" onClick={() => {onRotateImage(imageIndex, 90);}}>
                    <i className="dtable-font dtable-icon-rotate"></i>
                  </span>
                }
                {downloadImage && (
                  <span className="image-footer-choice-item" onClick={() => {downloadImage(URL);}}>
                    <i className="dtable-font dtable-icon-download"></i>
                  </span>
                )}
              </div>
              {(!readOnly && deleteImage) &&
                <span className="image-footer-choice-item" onClick={() => {deleteImage(imageIndex, 'previewer');}}>
                  <i className="dtable-font dtable-icon-delete"></i>
                </span>
              }
            </div>
          </div>
        </ModalPortal>
      </MediaQuery>
    </Fragment>
  );
}

ImagePreviewerLightbox.propTypes = {
  imageItems: PropTypes.array.isRequired,
  imageIndex: PropTypes.number.isRequired,
  closeImagePopup: PropTypes.func.isRequired,
  moveToPrevImage: PropTypes.func.isRequired,
  moveToNextImage: PropTypes.func.isRequired,
  downloadImage: PropTypes.func,
  deleteImage: PropTypes.func,
  onRotateImage: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default ImagePreviewerLightbox;
