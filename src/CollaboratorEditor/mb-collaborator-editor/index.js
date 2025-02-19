import React from 'react';
import PropTypes from 'prop-types';
import { searchCollaborators } from 'dtable-utils';
import { getLocale } from '../../lang';
import MBEditorHeader from '../../MBEditorHeader';
import DTableSearchInput from '../../DTableSearchInput';

import './index.css';

const propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  value: PropTypes.array.isRequired,
  column: PropTypes.object.isRequired,
  collaborators: PropTypes.array.isRequired,
  onCommit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

class MBCollaboratorEditor extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
    };
  }

  componentDidMount() {
    history.pushState(null, null, '#'); // eslint-disable-line
    window.addEventListener('popstate', this.handleHistoryBack, false);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handleHistoryBack, false);
  }

  handleHistoryBack = (e) => {
    e.preventDefault();
    this.props.onClosePopover();
  };

  onContainerClick = (event) => {
    if (this.editorPopover && this.editorPopover.contains(event.target)) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      return false;
    }
  };

  onChangeSearch = (newValue) => {
    let { searchVal } = this.state;
    if (searchVal === newValue) return;
    this.setState({ searchVal: newValue });
  };

  getSelectedCollaborators = () => {
    let { value, collaborators } = this.props;
    if (!Array.isArray(value)) {
      return [];
    }
    return collaborators.filter(collaborator => {
      return value.indexOf(collaborator.email) > -1;
    });
  };

  getFilteredCollaborators = () => {
    let { collaborators } = this.props;
    let { searchVal } = this.state;
    return searchVal ? searchCollaborators(collaborators, searchVal) : collaborators;
  };

  onCollaboratorClick = (collaborator) => {
    this.props.onCommit(collaborator);
  };

  onRemoveCollaborator = (collaborator) => {
    this.props.onCommit(collaborator);
  };

  renderFilteredCollaborators = (collaborators) => {
    let { value = [] } = this.props;
    return collaborators.map((collaborator, index) => {
      const isSelected = value.includes(collaborator.email);

      return (
        <div className="mb-collaborator-option-item" key={index} onMouseDown={this.onCollaboratorClick.bind(this, collaborator)}>
          <span className="mb-collaborator-info">
            <span className="collaborator-avatar">
              <img src={collaborator.avatar_url} width="24" height="24" alt="avatar"/>
            </span>
            <span className="collaborator-name">{collaborator.name}</span>
          </span>
          {isSelected && (<i className="mb-collaborator-checked dtable-font dtable-icon-check-mark"></i>)}
        </div>
      );
    });
  };

  setEditorPopover = (editorPopover) => {
    this.editorPopover = editorPopover;
  };

  render() {
    const { column } = this.props;
    const { searchVal } = this.state;
    let filteredCollaborators = this.getFilteredCollaborators();

    return (
      <div ref={this.setEditorPopover} className="dtable-ui-mb-editor-popover mb-collaborator-editor-popover" onClick={this.onContainerClick}>
        <MBEditorHeader
          title={column.name}
          leftContent={(<i className="dtable-font dtable-icon-return"></i>)}
          rightContent={(<span>{getLocale('Done')}</span>)}
          onLeftClick={this.props.onClose}
          onRightClick={this.props.onClose}
        />
        <div className="dtable-ui-mb-editor-body dtable-ui-mb-collaborator-editor-body">
          <div className="mb-search-collaborator-items">
            <DTableSearchInput autoFocus={true} value={searchVal} placeholder={getLocale('Search_collaborator')} onChange={this.onChangeSearch} />
          </div>
          <div className="mb-collaborators-container">
            <div className="title">{getLocale('Choose_a_collaborator')}</div>
            <div className="content">
              {filteredCollaborators.length === 0 && (
                <div className="search-result-none">{getLocale('No_collaborators_available')}</div>
              )}
              {filteredCollaborators.length > 0 && this.renderFilteredCollaborators(filteredCollaborators)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MBCollaboratorEditor.propTypes = propTypes;

export default MBCollaboratorEditor;
