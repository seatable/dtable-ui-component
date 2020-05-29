import React from 'react';
import PropTypes from 'prop-types';
import { getLocale } from '../../lang';
import MBEditorHeader from '../common/mobile/mb-editor-header';

const propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  value: PropTypes.array.isRequired,
  column: PropTypes.object.isRequired,
  collaborators: PropTypes.array.isRequired,
  onCollaboratorItemToggle: PropTypes.func.isRequired,
  onClosePopover: PropTypes.func,
};

class MBCollaboratorEditorPopover extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
    };
  }

  componentDidMount() {
    history.pushState(null, null, '#'); // eslint-disable-line
    window.addEventListener('popstate', this.handleHistaryBack, false);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handleHistaryBack, false);
  }

  handleHistaryBack = (e) => {
    e.preventDefault();
    this.props.onClosePopover();
  }

  onContainerClick = (event) => {
    if (this.editorPopover && this.editorPopover.contains(event.target)) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      return false;
    }
  }

  onChangeSearch = (event) => {
    let { searchVal } = this.state;
    if (searchVal === event.target.value) {
      return;
    }
    searchVal = event.target.value;
    this.setState({ searchVal });
  }

  getSelectedCollaborators = () => {
    let { value, collaborators } = this.props;
    if (!Array.isArray(value)) {
      return [];
    }
    return collaborators.filter(collaborator => {
      return value.indexOf(collaborator.email) > -1;
    });
  }

  getFilteredCollaborators = () => {
    let { collaborators } = this.props;
    let { searchVal } = this.state;
    return searchVal ? collaborators.filter((item) => item.name.indexOf(searchVal) > -1) : collaborators;
  }

  onSelectCollaborator = (collaborator) => {
    this.props.onCollaboratorItemToggle(collaborator);
  }

  onRemoveCollaborator = (collaborator) => {
    this.props.onCollaboratorItemToggle(collaborator);
  }

  renderFilteredCollaborators = (collaborators) => {
    let { value } = this.props;
    return collaborators.map((collaborator, index) => {
      let isSelect = value.some(item => item === collaborator.email);
  
      return (
        <div className="mb-collaborator-option-item" key={index} onMouseDown={this.onSelectCollaborator.bind(this, collaborator)}>
          <span className="mb-collaborator-info">
            <span className="collaborator-avatar">
              <img src={collaborator.avatar_url} width="24" height="24" alt="avatar"/>
            </span>
            <span className="collaborator-name">{collaborator.name}</span>
          </span>
          {isSelect && <i className="mb-collaborator-checked dtable-font dtable-icon-check-mark"></i>}
        </div>
      );
    });
  }

  setEditorPopover = (editorPopover) => {
    this.editorPopover = editorPopover;
  }

  render() {
    const { column } = this.props;
    const { searchVal } = this.state;
    let filteredCollaborators = this.getFilteredCollaborators();

    return (
      <div ref={this.setEditorPopover} className="mb-editor-popover mb-collaborator-editor-popover" onClick={this.onContainerClick}>
        <MBEditorHeader
          title={column.name}
          leftContent={(<i className="dtable-font dtable-icon-return"></i>)}
          rightContent={(<span>{getLocale('Done')}</span>)}
          onLeftClick={this.props.onClosePopover}
          onRightClick={this.props.onClosePopover}
        />
        <div className="mb-editor-body mb-collaborator-editor-body">
          <div className="mb-search-collaborator-items">
            <input
              className="form-control"
              type="text"
              placeholder={getLocale('Find_a_collaborator')}
              value={searchVal}
              onChange={this.onChangeSearch}
              onClick={this.onInputClick}
            />
          </div>
          <div className="mb-collaborators-container">
            <div className="title">{getLocale('Choose_a_collaborator')}</div>
            <div className="content">
              {filteredCollaborators.length === 0 && (
                <div className="search-result-none">{getLocale('No_collaborators_avaliable')}</div>
              )}
              {filteredCollaborators.length > 0 && this.renderFilteredCollaborators(filteredCollaborators)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MBCollaboratorEditorPopover.propTypes = propTypes;

export default MBCollaboratorEditorPopover;
