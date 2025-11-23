import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { searchCollaborators } from 'dtable-utils';
import ModalPortal from '../../../ModalPortal';
import { getSelectionCoords, Utilities } from '../../utils';
import ImagePreviewerLightbox from '../../../ImagePreviewerLightbox';
import FileUploader from '../../../FileUploader';
import { KeyCodes } from '../../../constants';
import { isModZ, isShiftEnter, isModP } from '../../../utils/hotkey';
import Participant from './participant';
import { getLocale } from '../../../lang';

import './index.css';

const FONT_SIZE_WIDTH = 15;
const PADDING_WIDTH = 9;
const LINE_HEIGHT = 22;
const POPOVER_PADDING_HEIGHT = 10;
const DOWN = 'down';
const UP = 'up';

class Input extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filteredCollaborators: [],
      caretPosition: {},
      range: null,
      imageUrlList: [],
      activeCollaboratorIndex: 0,
      largeImageIndex: -1,
    };
    this.commentUtilities = new Utilities();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.hidePopover);
    if (this.props.autoFocusInput) {
      this.commentRef.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hidePopover);
  }

  hidePopover = (event) => {
    if (this.commentPopoverRef && event && !this.commentPopoverRef.contains(event.target)) {
      this.onHidePopover();
    }
  };

  onHidePopover = () => {
    if (this.state.filteredCollaborators.length > 0) {
      this.setState({ filteredCollaborators: [], activeCollaboratorIndex: 0 });
    }
  };

  setPopoverPosition = () => {
    const { caretPosition } = this.state;
    let { right, left } = this.commentRef.getBoundingClientRect();
    this.commentPopoverRef.style.left = `${caretPosition.x + FONT_SIZE_WIDTH}px`;
    this.commentPopoverRef.style.top = `${caretPosition.y - this.commentPopoverRef.offsetHeight}px`;
    if (caretPosition.x + FONT_SIZE_WIDTH > right - PADDING_WIDTH) { // is last code
      this.commentPopoverRef.style.left = `${left + PADDING_WIDTH + FONT_SIZE_WIDTH }px`;
      this.commentPopoverRef.style.top = `${caretPosition.y - this.commentPopoverRef.offsetHeight + LINE_HEIGHT}px`;
    }

    if (caretPosition.x + FONT_SIZE_WIDTH + this.commentPopoverRef.offsetWidth > document.body.clientWidth) {
      this.commentPopoverRef.style.right = 0;
      this.commentPopoverRef.style.left = '';
    }
  };

  onKeyDown = (event) => {
    if (isModZ(event)) {
      this.onHidePopover();
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      this.commentRef.innerHTML = '';
      return;
    } else if (isShiftEnter(event)) {
      return;
    } else if (isModP(event)) {
      this.commentRef.blur();
    }
    switch (event.keyCode) {
      case KeyCodes.DownArrow:
      case KeyCodes.UpArrow: {
        event.stopPropagation();
        if (this.commentPopoverRef) {
          event.preventDefault();
        }
        break;
      }
      case KeyCodes.Enter: {
        event.preventDefault();

        // exec select collaborator operation.
        if (this.state.filteredCollaborators.length > 0) {
          break;
        }
        this.props.onSubmit();
        break;
      }
      default: {
        break;
      }
    }
  };

  onFocus = () => {
    this.props.onInputFocus && this.props.onInputFocus();
  };

  onBlur = () => {
    this.props.onInputBlur && this.props.onInputBlur();
  };

  setScrollTop = (offsetTop, itemOffsetHeight, mouseDownType) => {
    let { offsetHeight, scrollTop } = this.commentPopoverRef;

    if (mouseDownType === DOWN) {
      if (offsetTop + itemOffsetHeight - scrollTop - offsetHeight + POPOVER_PADDING_HEIGHT > 0) {
        let top = offsetTop + itemOffsetHeight - offsetHeight + POPOVER_PADDING_HEIGHT;
        this.commentPopoverRef.scrollTop = top;
      }
    }

    if (mouseDownType === UP) {
      if (offsetTop < scrollTop) {
        this.commentPopoverRef.scrollTop = offsetTop - POPOVER_PADDING_HEIGHT;
      }
    }
  };

  setCommentInputValue = () => {
    this.commentRef.innerHTML = '';
  };

  getCommentInputValue = () => {
    return this.commentRef.innerHTML;
  };

  onInsertElement = (content, nodeType) => {
    const selection = window.getSelection();
    let { range } = this.state;
    let newRange = this.commentUtilities.onInsertElement({ selection, range, content, nodeType, commentRef: this.commentRef });
    this.setState({ range: newRange });
  };

  createHtmlElement = (selection, range, content, nodeType) => {
    let spanNode1;
    let spanNode2;
    let imageContainer;

    if (nodeType === 'image') {
      spanNode1 = document.createElement('div');
      spanNode1.className = 'image-container';
      spanNode1.contentEditable = 'false';
      imageContainer = document.createElement('img');
      imageContainer.src = content;
      imageContainer.height = 60;
      spanNode1.appendChild(imageContainer);
      spanNode2 = document.createElement('span');
      spanNode2.innerHTML = ' ';
    }

    if (nodeType === 'collaborator') {
      spanNode1 = document.createElement('span');
      spanNode2 = document.createElement('span');
      spanNode1.className = 'at-text';
      spanNode1.contentEditable = 'false';
      spanNode1.innerHTML = `@${content.name}`;
      spanNode2.innerHTML = ' ';
    }

    let frag = document.createDocumentFragment();
    let node;
    let lastNode;
    frag.appendChild(spanNode1);
    while ((node = spanNode2.firstChild)) {
      lastNode = frag.appendChild(node);
    }

    if (!range) {
      this.commentRef.appendChild(frag);
      range = selection.getRangeAt(0);
    } else {
      range.insertNode(frag);
    }
    if (lastNode) {
      range = range.cloneRange();
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    this.setState({ range: selection.getRangeAt(0) });
  };

  onSelectCollaborator = (collaborator) => {
    const selection = window.getSelection();
    let { range } = this.state;
    let callBack = () => {
      this.onHidePopover();
      this.props.addParticipant(collaborator.email);
    };
    let newRange = this.commentUtilities.onSelectParticipant({
      selection,
      range,
      participant: collaborator,
      callBack,
      commentRef: this.commentRef
    });
    this.setState({ range: newRange });
  };

  onPaste = (event) => {
    let _this = this;
    let callBack = (files) => {
      _this.uploaderFileRef.handleFilesChange(files);
    };
    this.commentUtilities.onPaste(event, callBack);
  };

  onFileUploadSuccess = (uploadFileMessage) => {
    this.onInsertElement(uploadFileMessage.url, 'image');
  };

  handleImageZoom = (event) => {
    event.persist();
    if (event.target.tagName === 'IMG') {
      let imageUrl = event.target.src;
      let imageTagList = this.commentRef.getElementsByTagName('img');
      let imageUrlList = [];
      for (let i = 0; i < imageTagList.length; i++) {
        imageUrlList.push(imageTagList[i].src);
      }
      this.setState({
        imageUrlList: imageUrlList,
        largeImageIndex: imageUrlList.findIndex(imageItemUrl => imageItemUrl === imageUrl),
      });
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
      largeImageIndex: -1,
      imageUrlList: []
    });
  };

  onKeyUp = (event) => {
    const selection = window.getSelection();
    this.setState({
      range: selection.getRangeAt(0)
    });
    if (event.keyCode === KeyCodes.DownArrow) {
      return this.handleSelectingCollaborator(event, DOWN);
    }
    if (event.keyCode === KeyCodes.UpArrow) {
      return this.handleSelectingCollaborator(event, UP);
    }
    if (event.keyCode === KeyCodes.Enter) {
      return this.handleSelectCollaborator();
    }
    this.handleMentions(event);
  };

  onMouseUp = () => {
    const selection = window.getSelection();
    this.setState({
      range: selection.getRangeAt(0)
    });
  };

  checkMentionOperation = (event) => {
    const { keyCode } = event;
    const { Escape, LeftArrow, RightArrow } = KeyCodes;
    if (keyCode === Escape || keyCode === LeftArrow || keyCode === RightArrow) {
      return false;
    }
    return true;
  };

  handleMentions = (event) => {
    if (this.props.isArchive) {
      return;
    }
    const isValidOperation = this.checkMentionOperation(event);
    if (!isValidOperation) {
      return this.onHidePopover();
    }
    const selection = window.getSelection();
    const { collaborators } = this.props;
    let filteredCollaborators = [];
    const { isCollapsed, anchorNode, anchorOffset } = selection;
    if (!isCollapsed || !anchorNode || !anchorNode.data) {
      return this.onHidePopover();
    }
    const text = anchorNode.data;
    const atIndex = this.commentUtilities.getAtIndexWithAnchorPosition(anchorOffset, text);
    if (atIndex === -1) {
      return this.onHidePopover();
    }
    if (atIndex === 0 || text[atIndex - 1] === ' ') {
      if (atIndex === anchorOffset - 1) {
        filteredCollaborators = [...collaborators];
      } else {
        const searchingText = text.substring(atIndex + 1);
        if (searchingText) {
          filteredCollaborators = searchCollaborators(collaborators, searchingText);
        }
      }
    }
    if (filteredCollaborators.length === 0) {
      return this.onHidePopover();
    }
    this.setState({
      filteredCollaborators,
      activeCollaboratorIndex: 0,
      caretPosition: getSelectionCoords(),
      range: selection.getRangeAt(0),
    }, () => {
      this.setPopoverPosition();
    });
  };

  handleSelectingCollaborator = (event, direction) => {
    event.stopPropagation();
    const { filteredCollaborators, activeCollaboratorIndex } = this.state;
    const collaboratorsLen = filteredCollaborators.length;
    if (collaboratorsLen === 0) {
      return;
    }
    let nextActiveCollaboratorIndex = activeCollaboratorIndex;
    if (direction === DOWN) {
      nextActiveCollaboratorIndex++;
      if (nextActiveCollaboratorIndex >= collaboratorsLen) {
        nextActiveCollaboratorIndex = 0;
      }
    } else {
      nextActiveCollaboratorIndex--;
      if (nextActiveCollaboratorIndex < 0) {
        nextActiveCollaboratorIndex = collaboratorsLen - 1;
      }
    }
    this.setState({
      activeCollaboratorIndex: nextActiveCollaboratorIndex,
    });
  };

  handleSelectCollaborator = () => {
    const { filteredCollaborators, activeCollaboratorIndex } = this.state;
    if (filteredCollaborators.length === 0) {
      return;
    }
    this.onSelectCollaborator(filteredCollaborators[activeCollaboratorIndex]);
  };

  setImageIndex = (index) => {
    this.setState({ largeImageIndex: index });
  };

  render() {
    const { api } = this.props;
    const { imageUrlList, largeImageIndex, filteredCollaborators, activeCollaboratorIndex } = this.state;
    return (
      <Fragment>
        <div
          className={classnames('dtable-ui-comment-input', { 'dtable-ui-comment-input-archive': !api?.add })}
          ref={ref => this.commentRef = ref}
          onKeyDown={this.onKeyDown}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyUp={this.onKeyUp}
          onMouseUp={this.onMouseUp}
          onPaste={this.onPaste}
          placeholder={getLocale('Add_comment')}
          onClick={this.handleImageZoom}
          tabIndex={-1}
          contentEditable
        >
        </div>
        {filteredCollaborators.length > 0 && (
          <ModalPortal>
            <div className="dtable-ui-comment-caret-list" ref={ref => this.commentPopoverRef = ref}>
              {filteredCollaborators.map((participant, i) => {
                return (
                  <Participant
                    key={participant.email}
                    index={i}
                    activeIndex={activeCollaboratorIndex}
                    participant={participant}
                    setScrollTop={this.setScrollTop}
                    onSelect={this.onSelectCollaborator.bind(this, participant)}
                  />
                );
              })}
            </div>
          </ModalPortal>
        )}
        {largeImageIndex > -1 &&
          <ImagePreviewerLightbox
            imageItems={imageUrlList}
            imageIndex={this.state.largeImageIndex}
            closeImagePopup={this.hideLargeImage}
            moveToPrevImage={this.movePrev}
            moveToNextImage={this.moveNext}
            setImageIndex={this.setImageIndex}
          />
        }
        <FileUploader
          className="dtable-ui-comment-paste-uploader"
          ref={ref => this.uploaderFileRef = ref}
          onFileUploadSuccess={this.onFileUploadSuccess}
          uploadFile={this.props.uploadFile}
        />
      </Fragment>
    );
  }
}

Input.propTypes = {
  autoFocusInput: PropTypes.bool,
  canUpdateParticipants: PropTypes.bool,
  collaborators: PropTypes.array,
  onSubmit: PropTypes.func,
  uploadFile: PropTypes.func,
  addParticipant: PropTypes.func,
  onInputFocus: PropTypes.func,
  onInputBlur: PropTypes.func,
};

export default Input;
