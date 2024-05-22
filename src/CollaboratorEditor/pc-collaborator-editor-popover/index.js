import React from 'react';
import PropTypes from 'prop-types';
import { getLocale } from '../../lang';
import CollaboratorItem from '../../CollaboratorItem';

import './index.css';

const propTypes = {
  popoverPosition: PropTypes.object.isRequired,
  selectedCollaborators: PropTypes.array.isRequired,
  collaborators: PropTypes.array.isRequired,
  onCollaboratorItemToggle: PropTypes.func.isRequired,
  setPopoverRef: PropTypes.func.isRequired,
};

class PCCollaboratorEditorPopover extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    };
    this.editorInputRef = React.createRef();
  }

  componentDidMount() {
    this.editorInputRef.current.focus();
  }

  onValueChanged = (event) => {
    let value = event.target.value;
    this.setState({searchValue: value});
  };

  onInputClick = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
  };

  onCollaboratorItemToggle = (item) => {
    this.props.onCollaboratorItemToggle(item);
  };

  getFilterCollaborator = () => {
    let { collaborators } = this.props;
    let filter = this.state.searchValue.toLowerCase();
    if (!filter) {
      return collaborators;
    }
    return collaborators.filter(collaborator => {
      return (collaborator.name.toString().toLowerCase()).indexOf(filter) > -1;
    });
  };

  render() {
    let { searchValue } = this.state;
    let { selectedCollaborators, popoverPosition } = this.props;
    let collaborators = this.getFilterCollaborator();
    let popoverStyle = Object.assign({}, {...popoverPosition}, {position: 'absolute'});

    return (
      <div className="dtable-ui-editor-popover dtable-ui-collaborator-editor-popover" style={popoverStyle} ref={this.props.setPopoverRef}>
        <div className="collaborator-search-container">
          <input
            className="form-control"
            value={searchValue}
            onChange={this.onValueChanged}
            onClick={this.onInputClick}
            placeholder={getLocale('Search_collaborator')}
            ref={this.editorInputRef}
          ></input>
        </div>
        <div className="collaborator-list-container">
          {collaborators.length > 0 && (
            collaborators.map((collaborator, index)=> {
              const isSelect = selectedCollaborators.some((selectedCollaborator) => {
                return selectedCollaborator.email === collaborator.email;
              });
              return (
                <div key={index} className="collaborator-item-container" onClick={this.onCollaboratorItemToggle.bind(this, collaborator)}>
                  <CollaboratorItem collaborator={collaborator} />
                  <div className="collaborator-checked">
                    {isSelect && <i className="dtable-font dtable-icon-check-mark"></i>}
                  </div>
                </div>
              );
            })
          )}
          {collaborators.length === 0 && (<div className="no-search-result">{getLocale('No_collaborators_available')}</div>)}
        </div>
      </div>
    );
  }
}

PCCollaboratorEditorPopover.propTypes = propTypes;

export default PCCollaboratorEditorPopover;
