import React from 'react';
import PropTypes from 'prop-types';
import LocalFileAddition from './local-file-addition';
import { getLocale } from '../../../lang';

import './index.css';

class AdditionPreviewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'localFiles',
    };
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  render() {
    let { activeTab } = this.state;

    return (
      <div className="dtable-ui-image-addition-container">
        <div className="dtable-ui-image-addition-left">
          <div className="dtable-ui-image-addition-nav" >
            <div className={`dtable-ui-addition-item ${activeTab === 'localFiles' ? 'dtable-ui-addition-item-selected' : ''}`} onClick={this.toggle.bind(this, 'localFiles')}>
              {getLocale('Local_Files')}
            </div>
          </div>
        </div>
        <div className="dtable-ui-image-addition-right">
          <div className="dtable-ui-image-addition-right-container">
            {activeTab === 'localFiles' &&
              <LocalFileAddition
                config={this.props.config}
                uploadLocalFileValue={this.props.uploadLocalFileValue}
                deleteFile={this.props.deleteFile}
                fileUploadCompleted={this.props.fileUploadCompleted}
                uploadFile={this.props.uploadFile}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

AdditionPreviewer.propTypes = {
  uploadLocalFileValue: PropTypes.array,
  deleteFile: PropTypes.func,
  fileUploadCompleted: PropTypes.func,
};

export default AdditionPreviewer;
