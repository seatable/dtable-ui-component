import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { processor } from '@seafile/seafile-editor';
import ImagePreviewerLightbox from '../../ImagePreviewerLightbox';
import { getLocale } from '../../lang';

class Comment extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      commentContent: '',
      isShowLargeImage: false,
      imageUrlList: [],
      largeImageIndex: ''
    };
  }

  componentDidMount() {
    this.convertComment(this.props.comment.comment);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.comment.comment !== this.props.comment.comment) {
      this.convertComment(nextProps.comment.comment);
    }
  }

  toggleDropDownMenu = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  convertComment = (mdFile) => {
    // innerHtml transform & to &amp, After seafile-editor is upgraded, & will be converted to &amp; again,
    // so it needs to be converted back manually
    const mdString = mdFile.replaceAll('&amp;', '&');
    processor.process(mdString).then((result) => {
      let commentContent = String(result);
      let { isScrollBottom, onScrollBottom } = this.props;
      this.setState({ commentContent: commentContent });
      if (isScrollBottom) {
        onScrollBottom();
      }
    });
  };

  handleImageZoom = (event) => {
    if (event.target.tagName === 'IMG') {
      let imageUrl = event.target.src;
      let imageTagList = this.commentContentRef.getElementsByTagName('img');
      let imageUrlList = [];
      for (let i = 0; i < imageTagList.length; i++) {
        imageUrlList.push(imageTagList[i].src);
      }
      let largeImageIndex = imageUrlList.findIndex(imageItemUrl => imageItemUrl === imageUrl);
      this.setState({ isShowLargeImage: true, imageUrlList: imageUrlList, largeImageIndex: largeImageIndex });
    }
  };

  moveNext = () => {
    let images = this.state.imageUrlList;
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + 1) % images.length,
    }));
  };

  movePrev = () => {
    let images = this.state.imageUrlList;
    this.setState(prevState => ({
      largeImageIndex: (prevState.largeImageIndex + images.length - 1) % images.length,
    }));
  };

  hideLargeImage = () => {
    this.setState({
      isShowLargeImage: false,
      largeImageIndex: '',
      imageUrlList: []
    });
  };

  isCommentUserExist = (commentItem) => {
    const { collaborators } = this.props;
    return !!collaborators.find(collaborator => collaborator.email === commentItem.author);
  };

  renderInfo = (comment) => {
    const { collaborators } = this.props;
    let authorInfo = Array.isArray(collaborators) && collaborators.find(collaborator => comment.author === collaborator.email);
    return (
      <Fragment>
        <img className="avatar" src={authorInfo.avatar_url} alt=""/>
        <div className="reviewer-info">
          <div className="reviewer-name">{authorInfo.name}</div>
          <div className="review-time">{comment.create_at}</div>
        </div>
      </Fragment>
    );
  };

  onCommentClick = (e) => {
    // click participant link, page shouldn't jump
    if (e.target.nodeName !== 'A') return;
    const preNode = e.target.previousSibling;
    if (preNode && preNode.nodeType === 3 && preNode.nodeValue.slice(-1) === '@') {
      e.preventDefault();
    } else {
      e.target.setAttribute('target', '_blank');
    }
  };

  render() {
    const { comment, onResolve, onDelete } = this.props;
    const { username } = window.dtable;
    const moreOperationsText = getLocale('More_operations');
    if (!this.isCommentUserExist(comment)) return null;

    const isShowDropdownMenu = comment.author === username || !comment.resolved;
    return (
      <div className={`dtable-ui-comment-container ${comment.resolved ? 'dtable-ui-comment-container-resolved' : ''}`} id={comment.id}>
        <div className="dtable-ui-comment-info">
          {this.renderInfo(comment)}
          {isShowDropdownMenu &&
            <Dropdown isOpen={this.state.dropdownOpen} size="sm" className="dtable-ui-comments-dropdown" toggle={this.toggleDropDownMenu}>
              <DropdownToggle
                className="dtable-ui-comments-dropdown-btn"
                role="button"
                data-toggle="dropdown"
                title={moreOperationsText}
                aria-label={moreOperationsText}
                aria-expanded={this.state.dropdownOpen}
              >
                <i className="dtable-font dtable-icon-more-level" title={moreOperationsText} aria-label={moreOperationsText}></i>
              </DropdownToggle>
              <DropdownMenu className="dtable-dropdown-menu dropdown-menu dtable-ui-comment-dropdown-list">
                {!comment.resolved && onResolve &&
                  <DropdownItem onClick={(event) => onResolve(event, comment.id)}>
                    <span className="comment-icon dtable-font dtable-icon-mark mr-2"></span>
                    <span className="comment-text">{getLocale('Mark_as_resolved')}</span>
                  </DropdownItem>
                }
                {(comment.author === username) && onDelete &&
                  <DropdownItem onClick={(event) => onDelete(event, comment.id)}>
                    <span className="comment-icon dtable-font dtable-icon-delete mr-2"></span>
                    <span className="comment-text">{getLocale('Delete')}</span>
                  </DropdownItem>
                }
              </DropdownMenu>
            </Dropdown>
          }
        </div>
        <div className="dtable-ui-comment-content" onClick={e => this.onCommentClick(e)}>
          <div
            className="dtable-ui-comment-content-container"
            ref={ref => this.commentContentRef = ref}
            onClick={this.handleImageZoom}
            dangerouslySetInnerHTML={{ __html: this.state.commentContent }}
          >
          </div>
        </div>
        {this.state.isShowLargeImage && (
          <ImagePreviewerLightbox
            imageItems={this.state.imageUrlList}
            imageIndex={this.state.largeImageIndex}
            closeImagePopup={this.hideLargeImage}
            moveToPrevImage={this.movePrev}
            moveToNextImage={this.moveNext}
          />
        )}
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  collaborators: PropTypes.array,
  onDelete: PropTypes.func.isRequired,
  onResolve: PropTypes.func.isRequired,
  onScrollBottom: PropTypes.func.isRequired,
  isScrollBottom: PropTypes.bool.isRequired,
};

export default Comment;
