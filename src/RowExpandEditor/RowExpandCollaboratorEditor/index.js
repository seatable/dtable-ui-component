import React from 'react';
import PropTypes from 'prop-types';
import { KeyCodes } from '../../constants';
import classnames from 'classnames';
import CollaboratorEditor from '../../CollaboratorEditor';
import { getLocale } from '../../lang';
import CollaboratorItem from '../../CollaboratorItem';

import './index.css';

class RowExpandCollaboratorEditor extends React.Component {

  constructor(props) {
    super(props);
    const { row, column, valueKey } = this.props;
    this.state = {
      menuPosition: null,
      value: row[column[valueKey]] || [],
      showCollaboratorSelect: false,
      isDataLoaded: false,
      emailCollaboratorMap: {},
    };
  }

  componentDidMount() {
    this.initCollaborators(this.props);
    document.addEventListener('mousedown', this.hideSelect);
    document.addEventListener('keydown', this.onKeyDown);
    const eventBus = this.props.eventBus;
    if (eventBus) {
      this.unsubscribeCollaboratorsUpdated = eventBus.subscribe('collaborators-updated', this.updateCollaborators);
    } else {
      this.updateCollaborators();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    if (row._id !== this.props.row._id) {
      this.initCollaborators(nextProps);
      this.setState({
        value: row[column[valueKey]] || [],
        showCollaboratorSelect: false
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showCollaboratorSelect !== prevState.showCollaboratorSelect) {
      if (this.state.showCollaboratorSelect === true && this.props.onEditorOpen) {
        this.props.onEditorOpen();
      }
      if (this.state.showCollaboratorSelect === false && this.props.onEditorClose) {
        this.props.onEditorClose();
      }
    }
  }

  componentWillUnmount() {
    if (this.props.eventBus && this.unsubscribeCollaboratorsUpdated) {
      this.unsubscribeCollaboratorsUpdated();
    }
    document.removeEventListener('mousedown', this.hideSelect);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  initCollaborators = (props) => {
    const { row, column, valueKey } = props;
    const emails = row[column[valueKey]] || [];
    props.queryCollaborators && props.queryCollaborators(emails);
  };

  getCollaborators = () => {
    const { getCollaborators, collaborators } = this.props;
    if (getCollaborators) return getCollaborators();
    return collaborators || [];
  };

  updateCollaborators = () => {
    const collaborators = this.getCollaborators();
    let emailCollaboratorMap = {};
    collaborators.forEach(c => {
      emailCollaboratorMap[c.email] = c;
    });
    this.setState({ emailCollaboratorMap });
  };

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.Enter && this.props.isEditorFocus && !this.state.showCollaboratorSelect) {
      this.toggleCollaboratorSelect(true);
    }
  };

  hideSelect = (event) => {
    if (!this.state.showCollaboratorSelect || !event.target || event.target.tagName.toUpperCase() === 'INPUT') {
      return;
    }
    const editor = document.querySelector('.dtable-ui-collaborator-editor-container');
    if ((editor && editor.contains(event.target)) || this.collaboratorSelectRef.contains(event.target)) {
      return;
    }
    this.toggleCollaboratorSelect(false);
  };

  toggleCollaboratorSelect = (value) => {
    this.setState({ showCollaboratorSelect: value }, () => {
      if (!value) this.collaboratorContentRef.focus();
    });
  };

  onToggleSelect = (event) => {
    event.stopPropagation();
    this.props.updateTabIndex(this.props.columnIndex);
    this.toggleCollaboratorSelect(true);
  };

  onFocus = () => {
    this.props.updateTabIndex(this.props.columnIndex);
  };

  closeSelect = () => {
    this.toggleCollaboratorSelect(false);
  };

  onChange = (collaborator) => {
    let newValue = this.state.value.slice(0);
    const collaboratorIndex = newValue.findIndex(email => collaborator.email === email);
    if (collaboratorIndex === -1) {
      newValue.push(collaborator.email);
    } else {
      newValue.splice(collaboratorIndex, 1);
    }
    this.setState({ value: newValue });
    this.props.onCommit(newValue);
  };

  removeCollaborator = (index) => {
    let { value } = this.state;
    let newValue = value.slice(0);
    newValue.splice(index, 1);
    this.setState({ value: newValue });
    this.props.onCommit(newValue);
  };

  renderSelectedCollaborators = () => {
    const { isEditorFocus } = this.props;
    const { value, emailCollaboratorMap } = this.state;

    return (
      <div
        tabIndex={0}
        onFocus={this.onFocus}
        onClick={this.onToggleSelect}
        ref={ref => this.collaboratorContentRef = ref}
        className={classnames('dtable-ui dtable-ui-row-expand-select-editor custom-select', { 'focus': isEditorFocus })}
      >
        <div className="dtable-ui-row-expand-select-editor-inner">
          <div>
            {value.length > 0 &&
              <div className="dtable-ui-row-expand-select-options">
                {value.map((email, index) => {
                  let collaborator = emailCollaboratorMap[email];
                  if (collaborator) {
                    const { email } = collaborator;
                    return (
                      <CollaboratorItem
                        key={email}
                        collaborator={collaborator}
                        enableDeleteCollaborator={true}
                        onDeleteCollaborator={this.removeCollaborator.bind(this, index)}
                      />
                    );
                  }
                  collaborator = { name: getLocale('Unknown'), avatar_url: '', email: index + '' };
                  return (
                    <CollaboratorItem
                      key={index}
                      className="dtable-ui-unknown-collaborator"
                      collaborator={collaborator}
                      enableDeleteCollaborator={true}
                      onDeleteCollaborator={this.removeCollaborator.bind(this, index)}
                    />
                  );
                })}
              </div>
            }
          </div>
          <i aria-hidden="true" className="dtable-font dtable-icon-down3"></i>
        </div>
      </div>
    );
  };

  render() {
    const { collaborators, column } = this.props;
    const { showCollaboratorSelect, value } = this.state;
    return (
      <div className="position-relative mt-1 w-100" ref={ref => this.collaboratorSelectRef = ref} >
        {this.renderSelectedCollaborators()}
        <span ref={ref => this.targetRef = ref}></span>
        {showCollaboratorSelect && (
          <CollaboratorEditor
            target={this.targetRef}
            isInModal={true}
            value={value}
            column={column}
            collaborators={collaborators}
            onCommit={this.onChange}
            onClose={this.closeSelect}
          />
        )}
      </div>
    );
  }

}

RowExpandCollaboratorEditor.propTypes = {
  isEditorFocus: PropTypes.bool,
  row: PropTypes.object,
  column: PropTypes.object,
  columnIndex: PropTypes.number,
  valueKey: PropTypes.string,
  collaborators: PropTypes.array,
  eventBus: PropTypes.object,
  getCollaborators: PropTypes.func,
  queryCollaborators: PropTypes.func,
  onEditorOpen: PropTypes.func,
  onEditorClose: PropTypes.func,
  onCommit: PropTypes.func,
  updateTabIndex: PropTypes.func,
};

export default RowExpandCollaboratorEditor;
