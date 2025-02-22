import React, { Fragment } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import FileUploader from '../../../FileUploader';
import DTablePopover from '../../../DTablePopover';
import Loading from '../../../Loading';
import { getLocale } from '../../../lang';

import './index.css';

class Btns extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowPopover: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isAdding !== this.props.isAdding ||
      nextState.isShowPopover !== this.state.isShowPopover;
  }

  onHideCollaboratorTip = () => {
    this.setState({ isShowPopover: false });
  };

  onHandleCollaboratorTip = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    this.setState({ isShowPopover: !this.state.isShowPopover });
  };

  onChangeInputValue = (participant) => {
    this.props.onInsertElement(participant, 'collaborator');
    this.props.addParticipant(participant.email);
    this.onHideCollaboratorTip();
  };

  onSubmit = () => {
    this.props.onSubmit();
  };

  onFileUploadSuccess = (uploadFileMessage) => {
    this.props.onInsertElement(uploadFileMessage.url, 'image');
  };

  getCollaboratorContent = () => {
    const { collaborators } = this.props;
    return (
      <div className="comment-popover-list">
        {collaborators.map((participant) => {
          return (
            <div key={participant.email} className="comment-participant-item" onClick={this.onChangeInputValue.bind(this, participant)}>
              <div className="comment-participant-container">
                <div className="comment-participant text-truncate">
                  <img className="comment-dtable-ui-participant-avatar ml-2" alt={participant.name} src={participant.avatar_url} />
                  <span className="comment-participant-name text-truncate">{participant.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { isAdding, canUpdateParticipants } = this.props;
    return (
      <Fragment>
        <div className="dtable-ui-comment-input-btns">
          <div className="d-flex justify-content-between dtable-ui-comment-input-btns-container">
            <div className="dtable-ui-comment-input-btns-content" ref={ref => this.toolRef = ref}>
              <FileUploader
                uploadType="image"
                className="dtable-ui-comment-image-upload"
                onFileUploadSuccess={this.onFileUploadSuccess}
                uploadFile={this.props.uploadFile}
              >
                <span aria-hidden="true" className="dtable-font dtable-icon-picture-linear"></span>
              </FileUploader>
              {canUpdateParticipants && (<span className="dtable-ui-comment-collaborator-tip" onClick={this.onHandleCollaboratorTip}>@</span>)}
            </div>
            {isAdding ? (
              <Button className="dtable-ui-comment-submit" color="primary" size="sm" disabled><Loading /></Button>
            ) : (
              <Button className="dtable-ui-comment-submit" color="primary" size="sm" onClick={this.onSubmit} tabIndex={-1}>{getLocale('Submit')}</Button>
            )}
          </div>
        </div>
        {this.state.isShowPopover &&
          <DTablePopover
            target={this.toolRef}
            hideDTablePopover={this.onHideCollaboratorTip}
            hideDTablePopoverWithEsc={this.onHideCollaboratorTip}
          >
            {this.getCollaboratorContent()}
          </DTablePopover>
        }
      </Fragment>
    );
  }

}

Btns.propTypes = {
  collaborators: PropTypes.array,
  isAdding: PropTypes.bool,
  canUpdateParticipants: PropTypes.bool,
  uploadFile: PropTypes.func,
  onInsertElement: PropTypes.func,
  onSubmit: PropTypes.func,
  addParticipant: PropTypes.func,
};

export default Btns;
