import React from 'react';
import PropTypes from 'prop-types';
import { CellType } from 'dtable-utils';
import Loading from '../Loading';
import toaster from '../toaster';
import Body from './body';
import Footer from './footer';
import Model from './model';
import { getErrorMsg } from '../utils/utils';
import { getLocale } from '../lang';

import './index.css';

const ROW_COMMENT = 'row_comment';

class Comment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      collaborators: props.collaborators || [],
      comments: [],
      isLoading: true,
      isFirstLoading: true
    };
    this.unsubscribeNotification = null;
  }

  componentDidMount() {
    this.initComments(this.props.row);
    this.initCollaborators(this.props);
    this.unsubscribeNotification = this.props.eventBus?.subscribe('new-notification', this.onNewNotification);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.row._id !== nextProps.row._id) {
      this.initComments(nextProps.row);
      this.initCollaborators(nextProps);
      this.setState({ isFirstLoading: true, isLoading: true });
    }
  }

  componentWillUnmount() {
    this.body = null;
    this.bodyContent = null;
    this.unsubscribeNotification();
  }

  handleError = (error) => {
    let errMsg = getErrorMsg(error, true);
    if (!error.response || error.response.status !== 403) {
      toaster.danger(getLocale(errMsg));
    }
  };

  // comment and count
  updateCount = (row, count = 0) => {
    this.setState({ count }, () => {
      this.props.updateCount && this.props.updateCount(row, count);
    });
  };

  reCalculateComments = (row, pageNum = 10, isGetCount = true) => {
    this.initComments(row, 1, pageNum);
    if (!isGetCount) return;
    const { api } = this.props;
    api.getCount(row).then(res => {
      const count = res.data.count;
      this.updateCount(row, count);
    }).catch(e => {
      this.handleError(e);
    });
  };

  initComments = (row, page = 1, perPage = 10) => {
    const { api } = this.props;
    api.get(row, page, perPage).then((res) => {
      console.log(res);
      let comments = res.data.comment_list || [];
      let newComments = [];
      comments.forEach(item => {
        const comment = new Model(item);
        newComments.push(comment);
      });
      this.setState({ comments: newComments, isLoading: false });
    }).catch(e => {
      this.handleError(e);
    });
  };

  addComment = (newComment, { successCallback, failCallback }) => {
    const { row, api } = this.props;
    api.add(row, newComment).then(res => api.getCount(row)).then(res => {
      const count = res.data.count;
      this.updateCount(row, count);
      this.reCalculateComments(row, count, false);
      successCallback();
    }).catch(error => {
      failCallback && failCallback(error);
    });
    this.setState({ isFirstLoading: true });
  };

  resolveComment = (event, commentID) => {
    event.persist();
    const { row, api } = this.props;
    api.update(row, commentID, null, 1).then(() => {
      this.reCalculateComments(row);
    }).catch(error => {
      this.handleError(error);
    });
  };

  deleteComment = (event, commentID) => {
    const { api, row } = this.props;
    api.delete(row, commentID).then(() => {
      this.reCalculateComments(row);
    }).catch(e => {
      this.handleError(e);
    });
  };

  // notification
  onNewNotification = (notification) => {
    const { msg_type } = notification;
    if (msg_type !== ROW_COMMENT) return;
    this.setState({ isFirstLoading: true });
    const { row, api } = this.props;
    api.getCount(row).then(res => {
      const count = res.data.count;
      this.updateCount(row, count);
      this.reCalculateComments(row, count, false);
    }).catch(e => {
      this.handleError(e);
    });
  };

  // collaborators
  initCollaborators = (props) => {
    const { columns, row, collaborators } = props;

    let collaboratorColumnKeyList = [];
    columns.forEach(column => {
      if (column.type === CellType.COLLABORATOR) {
        collaboratorColumnKeyList.push(column.key);
      }
    });
    if (collaboratorColumnKeyList.length === 0) {
      this.setState({ collaborators });
      return;
    }

    let rowCollaborators = [];
    collaboratorColumnKeyList.forEach(collaboratorKey => {
      if (row[collaboratorKey] && row[collaboratorKey].length > 0) {
        rowCollaborators.push(...row[collaboratorKey]);
      }
    });
    rowCollaborators = Array.from(new Set(rowCollaborators));
    let newCollaborators = [];
    if (rowCollaborators.length > 0) {
      collaborators.forEach(collaborator => {
        let rowCollaborator = rowCollaborators.find(rowCollaboratorItem => {
          return rowCollaboratorItem === collaborator.email;
        });
        if (rowCollaborator) {
          newCollaborators.unshift(collaborator);
        } else {
          newCollaborators.push(collaborator);
        }
      });
    } else {
      newCollaborators = collaborators;
    }
    this.setState({ collaborators: newCollaborators });
  };

  // scroll
  onScrollBottom = () => {
    const commentListPaddingHeight = 16;
    this.body.scrollTop = this.bodyContent.offsetHeight - this.body.offsetHeight + commentListPaddingHeight;
    this.setState({ isFirstLoading: false });
  };

  onScroll = () => {
    if (this.body.offsetHeight + this.body.scrollTop + 1 < this.bodyContent.offsetHeight + 32) return; // 16 is padding height
    const { api, row } = this.props;
    const { comments, count } = this.state;
    let currentCommentsLength = comments.length;
    if (currentCommentsLength < count) { // Have pagination
      let page = currentCommentsLength % 10 === 0 ? Math.floor(currentCommentsLength / 10) + 1 : Math.ceil(currentCommentsLength / 10);
      if (page === 0) return;
      api.get(row, page, 10).then((res) => {
        let newComments = comments.slice(0);
        const nextPageCommentList = res.data.comment_list || [];
        nextPageCommentList.forEach(item => {
          const comment = new Comment(item);
          const commentId = comment.id;
          const commentIndex = newComments.findIndex(item => item.id === commentId);
          if (commentIndex === -1) {
            newComments.push(comment);
          }
        });
        this.setState({ comments: newComments, isFirstLoading: false });
      }).catch(e => {
        this.handleError(e);
      });
    }
  };

  render() {
    const { collaborators, comments, isLoading, isFirstLoading } = this.state;
    const { autoFocusInput, row, columns, onInputFocus, onInputBlur, api, uploadFile } = this.props;
    return (
      <div className="dtable-ui-comments h-100 w-100">
        <div className="dtable-ui-comments-body" onScroll={this.onScroll} ref={(ref) => this.body = ref}>
          <div ref={(ref) => this.bodyContent = ref}>
            {isLoading ? (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center"><Loading /></div>
            ) : (
              <Body
                isFirstLoading={isFirstLoading}
                comments={comments}
                collaborators={collaborators}
                onDelete={this.deleteComment}
                onResolve={this.resolveComment}
                onScrollBottom={this.onScrollBottom}
              />
            )}
          </div>
        </div>
        <Footer
          autoFocusInput={autoFocusInput}
          collaborators={collaborators}
          row={row}
          columns={columns}
          addComment={this.addComment}
          onChangeParticipants={api.modifyParticipants}
          uploadFile={uploadFile}
          onInputFocus={onInputFocus}
          onInputBlur={onInputBlur}
        />
      </div>
    );
  }
}

Comment.propTypes = {
  autoFocusInput: PropTypes.bool,
  isDisplayPa: PropTypes.bool,
  row: PropTypes.object,
  collaborators: PropTypes.array,
  eventBus: PropTypes.object,
  api: PropTypes.shape({
    get: PropTypes.func.isRequired, // get comments,
    getCount: PropTypes.func.isRequired, // get comments count,
    delete: PropTypes.func.isRequired, // delete comment
    modify: PropTypes.func.isRequired, // modify comment
    add: PropTypes.func.isRequired, // add comment
    modifyParticipants: PropTypes.func.isRequired, // modify participants
  }).isRequired,
  onInputFocus: PropTypes.func,
  onInputBlur: PropTypes.func,
  updateCount: PropTypes.func,
};

export default Comment;
