import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import EditEditorButton from '../cell-editor-widgets/edit-editor-button';
import CollaboratorItem from '../common/collaborator-item';
import PCCollaboratorEditorPopover from '../cell-editor-widgets/pc-collaborator-editor-popover';

const propTypes = {
  isReadOnly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  column: PropTypes.object,
  collaborators: PropTypes.array.isRequired,
  onCommit: PropTypes.func,
};

class CollaboratorEditor extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      newValue: Array.isArray(props.value) ? props.value : [],
      isPopoverShow: false,
      popoverPosition: {},
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentToggle);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentToggle);
  }

  onDocumentToggle = (e) => {
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

  onAddOptionToggle = (event) => {
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
    updated[column.key] = newValue;
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
      this.onClosePopover();
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

  setEditorContainerRef = (editorContainer) => {
    this.editorContainer = editorContainer;
  }

  setEditorRef = (editor) => {
    this.editor = editor;
  }

  render() {
    let { collaborators } = this.props;
    let { isPopoverShow, popoverPosition } = this.state;
    let selectedCollaborators = this.getFormattedCollaborators();
    console.log(this.props.value);
    console.log(selectedCollaborators);

    return (
      <div ref={this.setEditorContainerRef} className="cell-editor collaborator-editor">
        <div ref={this.setEditorRef} className="collaborator-editor-container">
          <EditEditorButton text={'Add an collaborator'} onClick={this.onAddOptionToggle} />
          <div className="collaborators-container">
            {selectedCollaborators.length > 0 && (
              selectedCollaborators.map(collaborator => {
                return (
                  <CollaboratorItem 
                    key={collaborator.email} 
                    collaborator={collaborator} 
                    enableDeleteCollaborator={true}
                    onDeleteCollaborator={this.onDeleteCollaborator}
                  />
                );
              })
            )}
          </div>
        </div>
        {isPopoverShow && (
          <Fragment>
            <MediaQuery query={'(min-width: 768px)'}>
              <PCCollaboratorEditorPopover 
                popoverPosition={popoverPosition}
                isReadOnly={this.props.isReadOnly}
                selectedCollaborators={selectedCollaborators}
                collaborators={collaborators}
                onCollaboratorItemToggle={this.onCollaboratorItemToggle}
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
