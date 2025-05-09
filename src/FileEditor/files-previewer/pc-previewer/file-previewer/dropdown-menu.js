import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from 'reactstrap';
import { getLocale } from '../../../../lang';

class FileDropdownMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isItemMenuShow: false,
      isRenameDialogShow: false,
    };
  }

  onDropdownToggleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ isItemMenuShow: !this.state.isItemMenuShow }, () => {
      if (this.state.isItemMenuShow) {
        this.props.freezeItem();
      } else {
        this.props.unFreezeItem();
        this.props.resetState();
      }
    });
  };

  onDeleteFile = (event) => {
    this.props.resetState();
    this.props.onDeleteFile(this.props.itemIndex);
  };

  onRenameFile = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    this.props.onRenameFile();
  };

  render() {
    const { onRenameFile, onDeleteFile } = this.props;
    return (
      <Dropdown isOpen={this.state.isItemMenuShow} toggle={this.onDropdownToggleClick} className="file-dropdown-menu">
        <DropdownToggle
          tag="span"
          role="button"
          data-toggle="dropdown"
          aria-expanded={this.state.isItemMenuShow}
          className="file-dropdown-icon"
          title={getLocale('More_operations')}
          aria-label={getLocale('More_operations')}
        >
          <span aria-hidden="true" className="dtable-font dtable-icon-more-vertical file-dropdown-more"></span>
        </DropdownToggle>
        <DropdownMenu className="dtable-dropdown-menu dropdown-menu">
          {onRenameFile && (
            <DropdownItem onClick={this.onRenameFile}>
              <i className="item-icon dtable-font dtable-icon-rename"></i>
              {getLocale('Rename')}
            </DropdownItem>
          )}
          {onDeleteFile && (
            <DropdownItem onClick={this.onDeleteFile}>
              <i className="item-icon dtable-font dtable-icon-delete"></i>
              {getLocale('Delete')}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

FileDropdownMenu.propTypes = {
  onDeleteFile: PropTypes.func,
  downloadFile: PropTypes.func,
  fileItem: PropTypes.object,
  onRenameFile: PropTypes.func,
  freezeItem: PropTypes.func,
  unFreezeItem: PropTypes.func,
  resetState: PropTypes.func,
  itemIndex: PropTypes.number,
};

export default FileDropdownMenu;
