import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Lightbox from '@seafile/react-image-lightbox';
import { getFileSuffix, generateCurrentBaseImageUrl, getImageThumbnailUrl, isCustomAssetUrl, isDigitalSignsUrl, isInternalImg, needUseThumbnailImage } from '../utils/url';
import { getLocale } from '../lang';

import '@seafile/react-image-lightbox/style.css';
import './index.css';

function ImagePreviewerLightbox(props) {
  const {
    imageItems, imageIndex, readOnly, className, server, workspaceID, dtableUuid,
    deleteImage, downloadImage, onRotateImage,
  } = props;
  const imageSrcList = imageItems.map((src) => {
    if (server && dtableUuid && isCustomAssetUrl(src)) {
      const assetUuid = src.slice(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
      return server + '/dtable/' + dtableUuid + '/custom-asset/' + assetUuid;
    }
    if (server && dtableUuid && workspaceID && isDigitalSignsUrl(src)) {
      return generateCurrentBaseImageUrl({
        server, workspaceID, dtableUuid, partUrl: src
      });
    }
    return src;
  });

  const imagesLength = imageSrcList.length;
  const [currentImageIndex, setCurrentImageIndex] = React.useState(imageIndex || 0);
  const URL = imageSrcList[currentImageIndex];

  React.useEffect(() => {
    setCurrentImageIndex(imageIndex);
  }, [imageIndex]);

  // Handle URL has special symbol %$
  let imageName = '';
  try {
    imageName = URL ? decodeURI(URL.slice(URL.lastIndexOf('/') + 1)) : '';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  const canRotateImage = onRotateImage && !readOnly && !['gif', 'heic', 'heif'].includes(getFileSuffix(URL)) && isInternalImg(URL, server);

  let mainSrc = URL;
  if (needUseThumbnailImage(URL)) {
    mainSrc = getImageThumbnailUrl(URL, { server, dtableUuid, workspaceID, size: 512 });
  }

  const imageTitleDOM = props.imageTitle || (
    <span className="d-flex">
      <span className="text-truncate">{imageName}</span>
      <span className="flex-shrink-0 pl-1">({currentImageIndex + 1}/{imagesLength})</span>
    </span>
  );

  return (
    <Lightbox
      imageItems={imageSrcList}
      currentIndex={currentImageIndex}
      setImageIndex={index => setCurrentImageIndex(index)}
      wrapperClassName={classnames('dtable-ui-component', className)}
      imageTitle={imageTitleDOM}
      mainSrc={mainSrc}
      nextSrc={imageSrcList[(currentImageIndex + 1) % imagesLength]}
      prevSrc={imageSrcList[(currentImageIndex + imagesLength - 1) % imagesLength]}
      imagePadding={70}
      viewOriginalImageLabel={getLocale('View_original_image')}
      enableRotate={canRotateImage}
      onCloseRequest={props.closeImagePopup}
      onMovePrevRequest={props.moveToPrevImage}
      onMoveNextRequest={props.moveToNextImage}
      onClickMoveUp={props.moveToPrevRowImage}
      onClickMoveDown={props.moveToNextRowImage}
      onViewOriginal={props.onViewOriginal}
      onRotateImage={canRotateImage ? (deg) => {onRotateImage(currentImageIndex, deg);} : null}
      onClickDelete={(!readOnly && deleteImage) ? () => {deleteImage(currentImageIndex, 'previewer');} : null}
      onClickDownload={downloadImage ? () => {downloadImage(URL);} : null}
      zoomInTip={getLocale('Zoom_in')}
      zoomOutTip={getLocale('Zoom_out')}
      rotateTip={getLocale('Rotate_image')}
      deleteTip={getLocale('Delete_image')}
      downloadImageTip={getLocale('Download_image')}
    />
  );
}

ImagePreviewerLightbox.propTypes = {
  className: PropTypes.string,
  imageItems: PropTypes.array.isRequired,
  imageIndex: PropTypes.number.isRequired,
  imageTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  readOnly: PropTypes.bool,
  server: PropTypes.string,
  workspaceID: PropTypes.string,
  dtableUuid: PropTypes.string,
  moveToPrevRowImage: PropTypes.func,
  moveToNextRowImage: PropTypes.func,
  onViewOriginal: PropTypes.func,
  closeImagePopup: PropTypes.func.isRequired,
  downloadImage: PropTypes.func,
  deleteImage: PropTypes.func,
  onRotateImage: PropTypes.func,
};

export default ImagePreviewerLightbox;
