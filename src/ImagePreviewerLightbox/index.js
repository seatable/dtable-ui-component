import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Lightbox from '@seafile/react-image-lightbox';
import { checkSVGImage, isInternalImg } from './utils';

import '@seafile/react-image-lightbox/style.css';

function ImagePreviewerLightbox(props) {
  const { imageItems, imageIndex, deleteImage, downloadImage, onRotateImage, readOnly, server,
    moveToPrevRowImage, moveToNextRowImage, className } = props;
  const imageItemsLength = imageItems.length;
  const URL = imageItems[imageIndex];
  const imageTitle = URL ? decodeURI(URL.slice(URL.lastIndexOf('/') + 1)) : '';
  // svg image is vectorgraph and can't rotate, external image can't rotate
  const canRotateImage = onRotateImage && !readOnly && !checkSVGImage(URL) && isInternalImg(URL, server);
  const imageTitleEl = (
    <span className="d-flex">
      <span className="text-truncate">{imageTitle}</span>
      <span className="flex-shrink-0">({imageIndex + 1}/{imageItemsLength})</span>
    </span>
  );
  return (
    <Lightbox
      wrapperClassName={classnames('dtable-ui-component', className)}
      imageTitle={imageTitleEl}
      mainSrc={imageItems[imageIndex]}
      nextSrc={imageItems[(imageIndex + 1) % imageItemsLength]}
      prevSrc={imageItems[(imageIndex + imageItemsLength - 1) % imageItemsLength]}
      onCloseRequest={props.closeImagePopup}
      onMovePrevRequest={props.moveToPrevImage}
      onMoveNextRequest={props.moveToNextImage}
      onClickMoveUp={moveToPrevRowImage}
      onClickMoveDown={moveToNextRowImage}
      onRotateImage={canRotateImage ? (deg) => {onRotateImage(imageIndex, deg);} : null}
      onClickDelete={(!readOnly && deleteImage) ? () => {deleteImage(imageIndex, 'previewer');} : null}
      onClickDownload={downloadImage ? () => {downloadImage(URL);} : null}
    />
  );
}

ImagePreviewerLightbox.propTypes = {
  className: PropTypes.string,
  imageItems: PropTypes.array.isRequired,
  imageIndex: PropTypes.number.isRequired,
  closeImagePopup: PropTypes.func.isRequired,
  moveToPrevImage: PropTypes.func.isRequired,
  moveToNextImage: PropTypes.func.isRequired,
  downloadImage: PropTypes.func,
  deleteImage: PropTypes.func,
  onRotateImage: PropTypes.func,
  readOnly: PropTypes.bool,
  server: PropTypes.string,
  moveToPrevRowImage: PropTypes.func,
  moveToNextRowImage: PropTypes.func,
};

export default ImagePreviewerLightbox;
