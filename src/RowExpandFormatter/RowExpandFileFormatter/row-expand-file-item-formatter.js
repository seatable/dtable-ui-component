import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import { getLocale } from '../../lang';
import { getFileThumbnailInfo } from '../../utils/url';
import DeleteTip from '../../DeleteTip'

export default class RowExpandFileItemFormatter extends Component {

  static propTypes = {
    downloadFile: PropTypes.func,
    deleteFile: PropTypes.func,
    index: PropTypes.number.isRequired,
    file: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired,
    readOnly: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      isTooltipOpen: false,
      isDeleteTipOpen: false,
    };
  }

  toggleTooltip = () => {
    this.setState({ isTooltipOpen: !this.state.isTooltipOpen });
  };

  closeDeleteTip = () => {
    this.setState({ isDeleteTipOpen: false });
  };

  onClickDelete = (e) => {
    e.stopPropagation();
    this.position = {
      top: e.clientY,
      left: e.clientX,
    };
    this.setState({ isDeleteTipOpen: true });
  };

  onDelete = (e) => {
    e.stopPropagation();
    this.closeDeleteTip();
    this.props.deleteFile(this.props.index);
  };

  render() {
    const { file, column, index, readOnly, downloadFile, deleteFile, config } = this.props;
    const id = 'file-list-preview-item' + column.key + index;
    const { fileIconUrl } = getFileThumbnailInfo(file, config);
    return (
      <>
        <div key={`file-${index}`} className="row-expand-item-file" id={id}>
          <img src={fileIconUrl} id={`item-file-${index}`} alt={file.name} />
          <div className="dtable-ui-file-icons-choice">
            {downloadFile &&
              <span className="file-icon" onClick={(e) => this.props.downloadFile(file, e)}>
                <i className="dtable-font dtable-icon-download"></i>
              </span>
            }
            {!readOnly && deleteFile &&
              <span className="file-icon" onClick={this.onClickDelete}>
                <i className="dtable-font dtable-icon-fork-number"></i>
              </span>
            }
          </div>
        </div>
        {this.state.isDeleteTipOpen &&
          <DeleteTip
            position={this.position}
            toggle={this.closeDeleteTip}
            handleDelete={this.onDelete}
            deleteTip={getLocale('Are_you_sure_you_want_to_delete_this_file')}
          />
        }
        <Tooltip
          placement='bottom'
          isOpen={this.state.isTooltipOpen}
          toggle={this.toggleTooltip}
          target={id}
          delay={{ show: 0, hide: 0 }}
          fade={false}
        >
          {file.name}
        </Tooltip>
      </>
    );
  }
}
