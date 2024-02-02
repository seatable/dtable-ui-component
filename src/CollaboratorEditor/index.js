import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { getLocale } from '../lang';
import ModalPortal from '../common/modal-portal';
import CollaboratorItem from '../CollaboratorItem';
import EditEditorButton from '../EditEditorButton';
import PCCollaboratorEditorPopover from './pc-collaborator-editor-popover';
import MBCollaboratorEditorPopover from './mb-collaborator-editor-popover';

import './index.css';

const propTypes = {
  isReadOnly: PropTypes.bool,
  isInModel: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  column: PropTypes.object,
  collaborators: PropTypes.array.isRequired,
  onCommit: PropTypes.func,
  isShowEditButton: PropTypes.bool,
};

class CollaboratorEditor extends React.Component {

  static defaultProps = {
    isShowEditButton: true,
    isReadOnly: false,
    value: [],
    isInModel: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      newValue: Array.isArray(props.value) ? props.value : [],
      isPopoverShow: false,
      popoverPosition: {},
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown = (e) => {
    if (this.state.isPopoverShow && this.editorPopoverRef) {
      if (this.editorPopoverRef === e.target || this.editorPopoverRef.contains(e.target)) {
        return;
      }
    }
    if (this.editorContainer !== e.target && !this.editorContainer.contains(e.target)) {
      this.onClosePopover();
    }
  }

  getFormattedCollaborators = () => {
    let { newValue }  = this.state;
    if (Array.isArray(newValue) && newValue.length > 0) {
      const { collaborators } = this.props;
      return newValue.map(collaboratorEmail => {
        return collaborators.find(collaborator => collaborator.email === collaboratorEmail);
      }).filter(collaborator => !!collaborator);
    }
    return [];
  }

  togglePopover = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
    if (this.props.isReadOnly) {
      return;
    }
    let isPopoverShow = !this.state.isPopoverShow;
    if (isPopoverShow) {
      let popoverPosition = this.caculatePopoverPosition();
      this.setState({isPopoverShow, popoverPosition});
    } else {
      this.setState({isPopoverShow});
    }
  }

  onCommit = (newValue) => {
    let updated = {};
    let { column } = this.props;
    updated[column.name] = newValue;
    this.props.onCommit(updated);
  }

  onCollaboratorItemToggle = (collaborator) => {
    let newValue = this.state.newValue.slice();
    let collaboratorIndex = newValue.findIndex(collaboratorEmail => collaboratorEmail === collaborator.email);
    if (collaboratorIndex !== -1) {
      newValue.splice(collaboratorIndex, 1);
    } else {
      newValue.push(collaborator.email);
    }

    this.setState({newValue}, () => {
      this.onCommit(newValue);
    });
  }

  onDeleteCollaborator = (collaborator) => {
    let newValue = this.state.newValue.slice();
    let optionIndex = newValue.findIndex(collaboratorEmail => collaboratorEmail === collaborator.email);
    if (optionIndex > -1) {
      newValue.splice(optionIndex, 1);
      this.setState({newValue}, () => {
        this.onCommit(newValue);
      });
    }
  }

  caculatePopoverPosition = () => {
    if (this.props.isInModel) {
      const { top, left } = this.editor.getBoundingClientRect();
      return {
        top: top + 40,
        left,
        zIndex: 1051,
      };
    }
    const POPOVER_MAX_HEIGHT = 200;
    let innerHeight = window.innerHeight;
    let { top, height } = this.editor.getClientRects()[0];
    let isBelow = (innerHeight - (top + height)) > POPOVER_MAX_HEIGHT;
    let position = { top : (height + 1), left: 0};
    if (!isBelow) {
      let bottom = height + 1;
      position = { bottom: bottom, left: 0 };
    }
    return position;
  }

  onClosePopover = () => {
    this.setState({isPopoverShow: false});
  }

  onClickContainer = (e) => {
    e.stopPropagation();
    if (!this.props.isShowEditButton && !this.state.isPopoverShow) {
      this.setState({
        isPopoverShow: true,
        popoverPosition: this.caculatePopoverPosition(),
      });
    }
  }

  setEditorContainerRef = (editorContainer) => {
    this.editorContainer = editorContainer;
  }

  setEditorRef = (editor) => {
    this.editor = editor;
  }

  setPopoverRef = (ref) => {
    this.editorPopoverRef = ref;
  }

  render() {
    let { collaborators, isReadOnly, isShowEditButton } = this.props;
    let { isPopoverShow, popoverPosition } = this.state;
    let selectedCollaborators = this.getFormattedCollaborators();
    let enableDeleteCollaborator = !isReadOnly;

    return (
      <div ref={this.setEditorContainerRef} className="dtable-ui-collaborator-editor">
        <div ref={this.setEditorRef} className={`dtable-ui-collaborator-editor-container ${isShowEditButton ? '' : 'dtable-ui-collaborator-editor-container-no-btn'}`} onClick={this.onClickContainer}>
          {isShowEditButton &&
            <EditEditorButton text={getLocale('Add_a_collaborator')} onClick={this.togglePopover} />
          }
          {selectedCollaborators.length > 0 && (
            <div className={`collaborators-container ${isShowEditButton ? 'mt-2' : ''}`}>
              {selectedCollaborators.map(collaborator => {
                return (
                  <CollaboratorItem
                    key={collaborator.email}
                    collaborator={collaborator}
                    enableDeleteCollaborator={enableDeleteCollaborator}
                    onDeleteCollaborator={this.onDeleteCollaborator}
                  />
                );
              })}
            </div>
          )}
        </div>
        {isPopoverShow && (
          <Fragment>
            <MediaQuery query={'(min-width: 768px)'}>
              <ModalPortal>
                <PCCollaboratorEditorPopover
                  popoverPosition={popoverPosition}
                  isReadOnly={this.props.isReadOnly}
                  selectedCollaborators={selectedCollaborators}
                  collaborators={collaborators}
                  onCollaboratorItemToggle={this.onCollaboratorItemToggle}
                  setPopoverRef={this.setPopoverRef}
                />
              </ModalPortal>
            </MediaQuery>
            <MediaQuery query={'(max-width: 767.8px)'}>
              <MBCollaboratorEditorPopover
                isReadOnly={this.props.isReadOnly}
                value={this.state.newValue}
                column={this.props.column}
                collaborators={this.props.collaborators}
                onCollaboratorItemToggle={this.onCollaboratorItemToggle}
                onClosePopover={this.onClosePopover}
              />
            </MediaQuery>
          </Fragment>
        )}
      </div>
    );
  }
}

CollaboratorEditor.propTypes = propTypes;

export default CollaboratorEditor;
