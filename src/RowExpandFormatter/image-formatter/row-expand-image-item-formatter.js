import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import MediaQuery from 'react-responsive';
import { getLocale } from '../../lang';
import DeleteTip from '../../DeleteTip';

export default class RowExpandImageItemFormatter extends Component {

  static propTypes = {
    downloadFile: PropTypes.func,
    deleteFile: PropTypes.func,
    onImageClick: PropTypes.func,
    index: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
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
    e.preventDefault();
    e.stopPropagation();
    this.position = {
      top: e.clientY,
      left: e.clientX,
    };
    this.setState({ isDeleteTipOpen: true });
  };

  onClickDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.downloadFile(this.props.url, e);
  };

  onDelete = (e) => {
    e.stopPropagation();
    this.closeDeleteTip();
    this.props.deleteFile(this.props.index);
  };

  onClickImage = () => {
    this.props.onImageClick(this.props.index);
  };

  render() {
    const { url, column, index, readOnly, downloadFile, deleteFile } = this.props;
    const id = 'image-list-preview-item' + column.key + index;
    const name = decodeURI(url.slice(url.lastIndexOf('/') + 1));
    return (
      <>
        <div key={`image-${index}`} className="row-expand-item-image" id={id} onClick={this.onClickImage}>
          <img src={url} id={`item-image-${index}`} alt={name} />
          <div className="dtable-ui-image-icons-choice">
            {downloadFile &&
              <span className="image-icon" onClick={this.onClickDownload}>
                <i className="dtable-font dtable-icon-download"></i>
              </span>
            }
            {!readOnly && deleteFile &&
              <span className="image-icon" onClick={this.onClickDelete}>
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
            deleteTip={getLocale('Are_you_sure_you_want_to_delete_this_image')}
          />
        }
        <MediaQuery query={'(min-width: 768px)'}>
          <Tooltip
            placement='bottom'
            isOpen={this.state.isTooltipOpen}
            toggle={this.toggleTooltip}
            target={id}
            delay={{ show: 0, hide: 0 }}
            fade={false}
          >
            {name}
          </Tooltip>
        </MediaQuery>
      </>
    );
  }
}
