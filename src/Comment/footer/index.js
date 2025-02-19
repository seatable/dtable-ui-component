import React from 'react';
import PropTypes from 'prop-types';
import toaster from '../../toaster';
import { getErrorMsg } from '../../utils/utils';
import Participants from './participants';
import Input from './input';
import Btns from './btns';

import './index.css';

class Footer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      participants: [],
    };
    this.commentInputRef = null;
  }

  componentDidMount() {
    this.initParticipants(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.row?._id !== nextProps.row?._id) {
      this.initParticipants(nextProps);
    }
  }

  initParticipants = (props) => {
    const { row, collaborators } = props;
    console.log(props);
    if (row._participants && Array.isArray(row._participants)) {
      let rowParticipants = row._participants.filter(Boolean);
      rowParticipants = rowParticipants.filter(participant => {
        const email = typeof participant === 'string' ? participant : participant.email;
        return !!collaborators.find(collaborator => collaborator.email === email);
      });
      this.setState({ participants: rowParticipants });
      return;
    }
    this.setState({ participants: [] });
  };

  updateParticipants = (participantList) => {
    this.setState({ participants: participantList }, () => {
      this.props.onChangeParticipants && this.props.onChangeParticipants(participantList);
    });
  };

  addParticipant = (email) => {
    if (!email) return;
    const { participants } = this.state;
    const { collaborators } = this.props;
    const isExist = participants.some(participant => participant.email === email);
    if (isExist) return;
    let newParticipantList = participants.slice(0);
    let newParticipant = collaborators.find(collaborator => collaborator.email === email);
    newParticipantList.push(newParticipant);
    this.updateParticipants(newParticipantList);
  };

  convertComment = (value) => {
    let regex = /<[a-zA-Z]+.*?>([\s\S]*?)<\/[a-zA-Z]*?>/g;
    let match;
    let start = 0;
    let newValue = '';
    while ((match = regex.exec(value)) !== null) {
      let notificationName = `${match[1]}`;
      let substr = value.substring(start, match.index);
      start = regex.lastIndex;
      newValue += substr + notificationName;
    }
    if (start < value.length) {
      newValue += value.slice(start);
    }
    return newValue;
  };

  updateAddState = (isAdding) => {
    this.setState({ isAdding });
  };

  handleError = (error) => {
    let errMsg = getErrorMsg(error, true);
    if (!error.response || error.response.status !== 403) {
      toaster.danger(this.props.t(errMsg));
    }
  };

  addComment = (comment) => {
    this.setState({ isAdding: true }, () => {
      this.props.addComment(comment, {
        successCallback: () => {
          this.commentInputRef.setCommentInputValue();
          this.updateAddState(false);
        },
        failCallback: (error) => {
          this.handleError(error);
          this.updateAddState(false);
        }
      });
    });
  };

  onSubmit = () => {
    const commentValue = this.commentInputRef.getCommentInputValue();
    const comment = this.convertComment(commentValue);
    if (!comment.trim()) return;
    this.addComment(comment);
    const { username } = window.dtable;
    this.addParticipant(username);
  };

  onInsertElement = (content, nodeType) => {
    this.commentInputRef.onInsertElement(content, nodeType);
  };

  render() {
    const { isAdding, participants } = this.state;
    const { collaborators } = this.props;
    const canUpdateParticipants = Boolean(this.props.onChangeParticipants);

    return (
      <div className="dtable-ui-comments-footer">
        <Participants canUpdate={canUpdateParticipants} participants={participants} collaborators={collaborators} showIconTip={true} onChange={this.updateParticipants} />
        <Input
          ref={ref => this.commentInputRef = ref}
          collaborators={collaborators}
          onSubmit={this.onSubmit}
          uploadFile={this.props.uploadFile}
          addParticipant={this.addParticipant}
          onInputFocus={this.props.onInputFocus}
          onInputBlur={this.props.onInputBlur}
          autoFocusInput={this.props.autoFocusInput}
          canUpdateParticipants={canUpdateParticipants}
        />
        <Btns
          isAdding={isAdding}
          canUpdateParticipants={canUpdateParticipants}
          collaborators={collaborators}
          uploadFile={this.props.uploadFile}
          onInsertElement={this.onInsertElement}
          onSubmit={this.onSubmit}
          addParticipant={this.addParticipant}
        />
      </div>
    );
  }
}

Footer.propTypes = {
  autoFocusInput: PropTypes.bool,
  canUpdateParticipants: PropTypes.bool,
  collaborators: PropTypes.array,
  onSubmit: PropTypes.func,
  uploadFile: PropTypes.func,
  addParticipant: PropTypes.func,
  onInputFocus: PropTypes.func,
  onInputBlur: PropTypes.func,
};

export default Footer;
