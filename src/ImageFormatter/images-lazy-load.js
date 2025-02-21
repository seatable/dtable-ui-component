import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading';
import { getImageThumbnailUrl } from '../utils/url';

const propTypes = {
  images: PropTypes.array.isRequired,
  server: PropTypes.string,
  onImageClick: PropTypes.func,
  renderItem: PropTypes.func,
  dtableUuid: PropTypes.string,
};

class ImagesLazyLoad extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      images: props.images,
      loadedImages: [],
      loadedCount: 0,
    };
  }

  componentDidMount = () => {
    this.lazyLoadImages(this.props);
  };

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.images.toString() !== this.props.images.toString()) {
      this.lazyLoadImages(nextProps);
    }
  };

  componentWillUnmount = () => {
    // prevent async operation
    this.setState = (state, callback) => { return; };
  };

  lazyLoadImages = (props) => {
    const { images } = props;
    if (!Array.isArray(images) || images.length === 0) {
      return;
    }
    this.setState({
      images,
      loadedImages: [],
      loadedCount: 0
    }, () => {
      let { server, dtableUuid } = this.props;
      images.forEach((item, index) => {
        let url = getImageThumbnailUrl(item, { server, dtableUuid });
        this.lazyLoadImage(
          url,
          (image) => {
            let { loadedCount, loadedImages } = this.state;
            let newImageList = loadedImages.slice(0);
            newImageList[index] = image;
            this.setState({ loadedCount: loadedCount + 1, loadedImages: newImageList });
          },
          () => {
            let { loadedCount } = this.state;
            this.setState({ loadedCount: loadedCount + 1 });
          }
        );
      });
    });
  };

  lazyLoadImage = (url, resolve, reject) => {
    if (!url) {
      reject('img path is require');
      return;
    }
    const image = new Image();
    image.onload = () => { resolve(image); };
    image.onerror = e => { reject(e); };
    image.src = url;
  };

  onMouseDown = (event) => {
    event.stopPropagation();
  };

  onImageClick = (event, index) => {
    event.stopPropagation();
    this.props.onImageClick(index);
  };

  render() {
    const { images, loadedImages, loadedCount } = this.state;
    const { renderItem } = this.props;

    if (!Array.isArray(images) || images.length === 0) {
      return '';
    }

    if (images.length > loadedCount) {
      let style = { marginLeft: '4px' };
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
            src={image.src}
            onMouseDown={this.onMouseDown}
            onClick={(event) => this.onImageClick(event, index)}
            alt=""
          />
        );
        if (renderItem) return (<Fragment key={index}>{renderItem(imgDom)}</Fragment>);
        return (<Fragment key={index}>{imgDom}</Fragment>);
      })
    );
  }
}

ImagesLazyLoad.propTypes = propTypes;

export default ImagesLazyLoad;
