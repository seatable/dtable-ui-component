import React from 'react';
import PropTypes from 'prop-types';
import LocalImageAddition from './local-image-addition';
import ImageLink from './image-link';
import { getLocale } from '../../lang';

import './index.css';

class AdditionPreviewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'localPicture',
    };
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  addFiles = (fileSelectedList) => {
    this.props.addUploadedFile(fileSelectedList);
    setTimeout(() => {
      this.props.showImageListPreviewer();
    }, 0);
  };

  render() {
    const { activeTab } = this.state;

    return (
      <div className="dtable-ui-image-addition-container">
        <div className="dtable-ui-image-addition-left">
          <div className="dtable-ui-image-addition-nav" >
            <div className={`dtable-ui-addition-item ${activeTab === 'localPicture' ? 'dtable-ui-addition-item-selected' : ''}`} onClick={this.toggle.bind(this, 'localPicture')}>
              {getLocale('Local_Images')}
            </div>
            {this.props.saveImageLink && (
              <div className={`dtable-ui-addition-item ${activeTab === 'imageLink' ? 'dtable-ui-addition-item-selected' : ''}`} onClick={this.toggle.bind(this, 'imageLink')}>
                {getLocale('Image_Link')}
              </div>
            )}
          </div>
        </div>
        <div className="dtable-ui-image-addition-right">
          <div className="dtable-ui-image-addition-right-container">
            {activeTab === 'localPicture' &&
              <LocalImageAddition
                uploadLocalImageValue={this.props.uploadLocalImageValue}
                deleteImage={this.props.deleteImage}
                fileUploadCompleted={this.props.fileUploadCompleted}
                uploadFile={this.props.uploadFile}
              />
            }
            {activeTab === 'imageLink' &&
              <ImageLink saveImageLink={this.props.saveImageLink}/>
            }
          </div>
        </div>
      </div>
    );
  }
}

AdditionPreviewer.propTypes = {
  togglePreviewer: PropTypes.func,
  uploadLocalImageValue: PropTypes.array,
  deleteImage: PropTypes.func,
  saveImageLink: PropTypes.func,
  fileUploadCompleted: PropTypes.func,
  addUploadedFile: PropTypes.func,
  showImageListPreviewer: PropTypes.func,
};

export default AdditionPreviewer;
