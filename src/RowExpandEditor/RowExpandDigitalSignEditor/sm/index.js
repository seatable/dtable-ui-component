import React from 'react';
import PropTypes from 'prop-types';
import ImageThumbnail from '../../../ImageThumbnail';
import DigitalSignUtils from '../../../DigitalSignEditor/utils';
import RowExpandAddBtn from '../../RowExpandAddBtn';
import DigitalSignEditor from '../../../DigitalSignEditor';
import { getLocale } from '../../../lang';
import { generateCurrentBaseImageUrl } from '../../../utils/url';

import './index.css';

class Small extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowEditor: false,
      updated: null,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.setState({
        updated: row[column[valueKey]] || [],
        isShowEditor: false,
      });
    }
  }

  toggleEditor = () => {
    this.setState({ isShowEditor: !this.state.isShowEditor });
  };

  onCommit = (value) => {
    this.props.onCommit(value);
    this.setState({ updated: value, isShowEditor: false });
  };

  getValue = () => {
    const { column, row, valueKey } = this.props;
    const { updated } = this.state;
    return updated ? updated : row[column[valueKey]];
  };

  deleteImage = () => {
    const { column, onCommit } = this.props;
    const updated = { [ column.key ]: null };
    onCommit(updated, column);
    this.setState({ updated: null });
  };

  getSignImages = () => {
    const { config } = this.props;
    const value = this.getValue();
    const signImageUrl = generateCurrentBaseImageUrl({ ...config, partUrl: DigitalSignUtils.getSignImageUrl(value) });
    return [signImageUrl].filter(Boolean);
  };

  renderSignature = (signImages) => {
    const { column, config } = this.props;
    const { key } = column;
    return signImages.map((src, index) => {
      return (
        <ImageThumbnail
          key={`sing-image-${key}-${index}`}
          index={index}
          src={src}
          className="mobile-dtable-ui-row-expand-img-item"
          config={config}
          onClick={this.toggleEditor}
          deleteImage={this.deleteImage}
          disableImageTooltip={true}
        />
      );
    });
  };

  render() {
    const { config, column } = this.props;
    const { isShowEditor } = this.state;
    const signImages = this.getSignImages();
    const signImageExisted = Array.isArray(signImages) && signImages.length > 0;
    return (
      <>
        <div className="mobile-dtable-ui-row-expand-image position-relative">
          {!signImageExisted && (
            <RowExpandAddBtn onClick={this.toggleEditor} text={getLocale('Edit_signature')} />
          )}
          {this.renderSignature(signImages)}
        </div>
        {isShowEditor && (
          <DigitalSignEditor
            config={config}
            value={this.getValue()}
            column={column}
            onCommitCancel={this.toggleEditor}
            onCommit={this.onCommit}
            uploadFile={this.props.uploadFile}
          />
        )}
      </>
    );
  }
}

Small.propTypes = {
  column: PropTypes.object,
  row: PropTypes.object,
  onCommit: PropTypes.func,
};

export default Small;
