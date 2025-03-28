import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading';
import { getImageThumbnailUrl } from '../utils/url';

const ImagesLazyLoad = ({ images, server, onImageClick, renderItem, dtableUuid }) => {
  const [currentImages, setCurrentImages] = useState(images);
  const [loadedImages, setLoadedImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);

  const lazyLoadImage = (url, resolve, reject) => {
    if (!url) {
      reject('img path is required');
      return;
    }
    const image = new Image();
    image.onload = () => { resolve(image); };
    image.onerror = (e) => { reject(e); };
    image.src = url;
  };

  const lazyLoadImages = () => {
    if (!Array.isArray(currentImages) || currentImages.length === 0) {
      return;
    }

    // Reset state for new images
    setLoadedImages([]);
    setLoadedCount(0);

    currentImages.forEach((item, index) => {
      const url = getImageThumbnailUrl(item, { server, dtableUuid });
      lazyLoadImage(
        url,
        (image) => {
          setLoadedImages(prev => {
            const newList = [...prev];
            newList[index] = image;
            return newList;
          });
          setLoadedCount(count => count + 1);
        },
        () => {
          setLoadedCount(count => count + 1);
        }
      );
    });
  };

  useEffect(() => {
    lazyLoadImages();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (images.toString() !== currentImages.toString()) {
      setCurrentImages(images);
    }
    // eslint-disable-next-line
  }, [images]);

  useEffect(() => {
    if (currentImages !== images) {
      lazyLoadImages();
    }
    // eslint-disable-next-line
  }, [currentImages]);

  const handleMouseDown = (event) => {
    event.stopPropagation();
  };

  const handleImageClick = (event, index) => {
    event.stopPropagation();
    if (onImageClick) {
      onImageClick(index);
    }
  };

  if (!Array.isArray(currentImages) || currentImages.length === 0) {
    return null;
  }

  if (currentImages.length > loadedCount) {
    const style = { marginLeft: '4px' };
    return <div style={style} className="d-flex align-items-center"><Loading /></div>;
  }

  return (
    loadedImages.map((image, index) => {
      let imageName = '';
      const imageSrc = image?.src;

      try {
        imageName = imageSrc ? decodeURI(imageSrc.slice(imageSrc.lastIndexOf('/') + 1)) : '';
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }

      const imgDom = (
        <img
          title={imageName}
          className="image-item"
          src={image?.src}
          onMouseDown={handleMouseDown}
          onClick={(event) => handleImageClick(event, index)}
          alt=""
        />
      );

      if (renderItem) return (<Fragment key={index}>{renderItem(imgDom)}</Fragment>);
      return (<Fragment key={index}>{imgDom}</Fragment>);
    })
  );
};

ImagesLazyLoad.propTypes = {
  images: PropTypes.array.isRequired,
  server: PropTypes.string,
  onImageClick: PropTypes.func,
  renderItem: PropTypes.func,
  dtableUuid: PropTypes.string,
};

export default ImagesLazyLoad;
