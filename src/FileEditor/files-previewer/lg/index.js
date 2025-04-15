import React from 'react';
import PropTypes from 'prop-types';
import { getValidFileImageUrls } from '../../../utils/url';
import { downloadFile, downloadFiles } from '../../../utils/utils';
import { FILE_EDITOR_STATUS } from '../../../constants';
import { getLocale } from '../../../lang';
import ImagePreviewerLightbox from '../../../ImagePreviewerLightbox';
import DTableCommonAddTool from '../../../DTableCommonAddTool';
import FilePreviewer from './file-previewer';

class Large extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowRename: false,
      value: props.value,
      isItemFreezed: false,
      isShowLargeImage: false,
      isSelectMultipleFiles: false,
      fileImageUrlList: [],
      selectedFilesList: [],
      largeImageIndex: -1
    };
  }

  componentDidMount() {
    this.getFileItemImageUrlList(this.props.value);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(nextProps.value)) {
      this.getFileItemImageUrlList(nextProps.value);
    }
  }

  getFileItemImageUrlList = (value) => {
    this.setState({ fileImageUrlList: getValidFileImageUrls(value) });
  };

  showLargeImage = (itemUrl) => {
    let { fileImageUrlList } = this.state;
    this.setState({
      isShowLargeImage: true,
      largeImageIndex: fileImageUrlList.indexOf(itemUrl)
    });
  };

  moveNext = () => {
    let { fileImageUrlList } = this.state;
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + 1) % fileImageUrlList.length,
    }));
  };

  movePrev = () => {
    let { fileImageUrlList } = this.state;
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + fileImageUrlList.length - 1) % fileImageUrlList.length,
    }));
  };

  hideLargeImage = () => {
    this.setState({
      isShowLargeImage: false,
      largeImageIndex: -1
    });
  };

  downloadImage = (imageItemUrl) => {
    const { value } = this.props;
    const file = value.find(v => v.url === imageItemUrl);
    if (!file) return;
    this.props.getDownLoadFiles([file], ([dFile]) => {
      dFile && downloadFile(dFile);
    });
  };

  onRotateImage = (imageIndex, degree) => {
    let { fileImageUrlList } = this.state;
    const imageUrl = fileImageUrlList[imageIndex];
    this.props.onRotateImage && this.props.onRotateImage(imageUrl, degree);
  };

  deleteImage = (index, type) => {
    const { value } = this.props;
    let { fileImageUrlList } = this.state;
    const imageUrl = fileImageUrlList[index];
    let fileItemIndex = value.findIndex(fileItem => fileItem.url === imageUrl);
    this.props.deleteFile(fileItemIndex, type);
    if (index > fileImageUrlList.length - 2) {
      if (fileImageUrlList.length - 2 < 0) {
        this.hideLargeImage();
      } else {
        this.setState({ largeImageIndex: 0 });
      }
    }
  };

  togglePreviewer = () => {
    this.props.togglePreviewer(FILE_EDITOR_STATUS.ADDITION);
    this.props.resetFileValue();
  };

  freezeItem = () => {
    this.setState({
      isItemFreezed: true
    });
  };

  unFreezeItem = () => {
    this.setState({
      isItemFreezed: false
    });
  };

  onSelectFiles = (name) => {
    const { selectedFilesList } = this.state;
    let filesList = selectedFilesList.slice(0);
    const selectedFileIndex = selectedFilesList.indexOf(name);
    if (selectedFileIndex > -1) {
      filesList.splice(selectedFileIndex, 1);
    } else {
      filesList.push(name);
    }
    this.setState({ selectedFilesList: filesList });
  };

  onSelectAllFiles = () => {
    const { value } = this.props;
    const { selectedFilesList } = this.state;
    if (value.length === 0) return;
    let allFilesList = selectedFilesList.slice(0);
    value.map((item) => {
      if (selectedFilesList.indexOf(item.name) === -1) {
        allFilesList.push(item.name);
      }
      return null;
    });
    this.setState({ selectedFilesList: allFilesList });
  };

  onChangeSelectMultipleFiles = (state) => {
    this.setState({
      isSelectMultipleFiles: state,
      selectedFilesList: []
    });
  };

  onDownloadAllSelectedFiles = () => {
    const { config } = this.props;
    const { selectedFilesList } = this.state;
    if (selectedFilesList.length === 0) return;
    this.props.getDownLoadFiles(selectedFilesList, (downloadFilesUrlList) => {
      if (downloadFilesUrlList.length > 0) {
        downloadFiles(downloadFilesUrlList, config);
      }
      this.onChangeSelectMultipleFiles(false);
    });
  };

  onDeleteAllSelectedFiles = () => {
    const { selectedFilesList } = this.state;
    this.props.deleteFiles(selectedFilesList);
    this.onChangeSelectMultipleFiles(false);
  };

  renderFilesOperation = () => {
    const { value, deleteFiles, getDownLoadFiles } = this.props;
    const { isSelectMultipleFiles, selectedFilesList } = this.state;
    if (value.length === 0) return null;
    return (
      <div className="dtable-ui-file-editor-operation-content">
        {!isSelectMultipleFiles ?
          <span onClick={this.onChangeSelectMultipleFiles.bind(this, true)}>{getLocale('Select')}</span> :
          <>
            {selectedFilesList.length > 0 &&
              <>
                {deleteFiles && (<span onClick={this.onDeleteAllSelectedFiles}>{getLocale('Delete')}</span>)}
                {getDownLoadFiles && (<span className="ml-2" onClick={this.onDownloadAllSelectedFiles}>{getLocale('Download')}</span>)}
              </>
            }
            <span className="ml-2" onClick={this.onSelectAllFiles}>{getLocale('Select_all')}</span>
            <span className="ml-2" onClick={this.onChangeSelectMultipleFiles.bind(this, false)}>{getLocale('Cancel')}</span>
          </>
        }
      </div>
    );
  };

  render() {
    let { value, getDownLoadFiles } = this.props;
    const { isSelectMultipleFiles, selectedFilesList } = this.state;
    return (
      <div className="dtable-ui-file-editor-previewer">
        <div className="dtable-ui-file-editor-previewer-wrapper">
          <div className="dtable-ui-file-editor-previewer-header d-flex align-items-center">
            {selectedFilesList.length > 0 ?
              <span className="dtable-ui-file-editor-count-content">
                {selectedFilesList.length === 1 ? getLocale('1_file_selected') : getLocale('Selected_xxx_files', { count: selectedFilesList.length })}
              </span> :
              <span className="dtable-ui-file-editor-count-content">
                {value.length <= 1 ? getLocale('xxx_existing_file', { count: value.length }) : getLocale('xxx_existing_files', { count: value.length })}
              </span>
            }
            {this.renderFilesOperation()}
          </div>
          <div className="dtable-ui-file-editor-previewer-content">
            {value.length > 0 && value.map((fileItem, index) => {
              const isSelected = selectedFilesList.indexOf(fileItem.name) === -1 ? false : true;
              return (
                <FilePreviewer
                  key={fileItem.url}
                  fileItem={fileItem}
                  deleteFile={this.props.deleteFile}
                  renameFile={this.props.renameFile}
                  freezeItem={this.freezeItem}
                  unFreezeItem={this.unFreezeItem}
                  isItemFreezed={this.state.isItemFreezed}
                  itemIndex={index}
                  isSelected={isSelected}
                  showLargeImage={this.showLargeImage}
                  onSelectFiles={this.onSelectFiles}
                  isSelectMultipleFiles={isSelectMultipleFiles}
                  downloadFile={getDownLoadFiles ? this.downloadImage : null}
                />
              );
            })}
          </div>
        </div>
        {this.state.isShowLargeImage &&
          <ImagePreviewerLightbox
            imageItems={this.state.fileImageUrlList}
            imageIndex={this.state.largeImageIndex}
            closeImagePopup={this.hideLargeImage}
            moveToPrevImage={this.movePrev}
            moveToNextImage={this.moveNext}
            deleteImage={this.deleteImage}
            downloadImage={this.downloadImage}
            onRotateImage={this.onRotateImage}
          />
        }
        <DTableCommonAddTool className="dtable-ui-file-editor-previewer-add-btn" callBack={this.togglePreviewer} footerName={getLocale('Add_files')} />
      </div>
    );
  }

}

Large.propTypes = {
  value: PropTypes.array,
  config: PropTypes.object,
  getDownLoadFiles: PropTypes.func,
  onRotateImage: PropTypes.func,
  deleteFile: PropTypes.func,
  renameFile: PropTypes.func,
  togglePreviewer: PropTypes.func,
  resetFileValue: PropTypes.func,
};

export default Large;
