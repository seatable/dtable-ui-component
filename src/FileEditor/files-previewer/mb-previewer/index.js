import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { downloadFile } from '../../../utils/utils';
import { getLocale } from '../../../lang';
import DTableCommonAddTool from '../../../DTableCommonAddTool';
import FilePreviewer from './file-previewer';

import './index.css';

class MBFilesPreviewer extends React.Component {

  downloadImage = (imageItemUrl) => {
    const { value } = this.props;
    const file = value.find(v => v.url === imageItemUrl);
    if (!file) return;
    this.props.getDownLoadFiles([file], ([dFile]) => {
      dFile && downloadFile(dFile);
    });
  };

  togglePreviewer = () => {
    this.props.togglePreviewer();
    this.props.resetFileValue();
  };

  render() {
    const { value, getDownLoadFiles } = this.props;
    return (
      <div className={classnames('dtable-ui-file-editor-previewer dtable-ui-mobile-file-editor-previewer', { 'mt-0': value.length === 0 })}>
        <div className={classnames('dtable-ui-file-editor-previewer-wrapper', { 'd-one': value.length === 0 })}>
          <div className="dtable-ui-file-editor-previewer-content">
            {value.length > 0 && value.map((fileItem, index) => {
              return (
                <FilePreviewer
                  key={fileItem.url}
                  fileItem={fileItem}
                  deleteFile={this.props.deleteFile}
                  renameFile={this.props.renameFile}
                  downloadFile={getDownLoadFiles ? this.downloadImage : null}
                />
              );
            })}
          </div>
        </div>
        <DTableCommonAddTool className="dtable-ui-file-editor-previewer-add-btn" callBack={this.togglePreviewer} footerName={getLocale('Add_files')} />
      </div>
    );
  }

}

MBFilesPreviewer.propTypes = {
  value: PropTypes.array,
  config: PropTypes.object,
  deleteFile: PropTypes.func,
  renameFile: PropTypes.func,
  getDownLoadFiles: PropTypes.func,
  togglePreviewer: PropTypes.func,
  resetFileValue: PropTypes.func,
};

export default MBFilesPreviewer;
