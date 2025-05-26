import React from 'react';
import PropTypes from 'prop-types';
import { searchCollaborators } from 'dtable-utils';
import MobileSelector from '../../MobileSelector';
import { getLocale } from '../../lang';
import CollaboratorItem from '../../CollaboratorItem';

import './index.css';

const { Search, Option, Options, Empty } = MobileSelector;

class MBCollaboratorEditor extends React.Component {

  static defaultProps = {
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
    this.props.onClose();
  };

  onChangeSearch = (newValue) => {
    let { searchVal } = this.state;
    if (searchVal === newValue) return;
    this.setState({ searchVal: newValue });
  };

  onChange = (collaborator) => {
    this.props.onCommit(collaborator);
  };

  renderCollaborators = (collaborators) => {
    const { value = [] } = this.props;
    return collaborators.map(collaborator => {
      const isSelected = value.includes(collaborator.email);

      return (
        <Option key={collaborator.email} isSelected={isSelected} onChange={this.onChange.bind(this, collaborator)}>
          <CollaboratorItem collaborator={collaborator} />
        </Option>
      );
    });
  };

  render() {
    const { column, collaborators } = this.props;
    const { searchVal } = this.state;
    const displayCollaborators = searchVal ? searchCollaborators(collaborators, searchVal) : collaborators;

    return (
      <MobileSelector onClose={this.props.onClose} title={column.name} className="dtable-ui-mobile-collaborator-editor">
        {collaborators.length > 10 && (
          <Search value={searchVal} placeholder={getLocale('Search_collaborator')} onChange={this.onChangeSearch} />
        )}
        <Options>
          {displayCollaborators.length === 0 && (<Empty>{getLocale('No_collaborators_available')}</Empty>)}
          {displayCollaborators.length > 0 && this.renderCollaborators(displayCollaborators)}
        </Options>
      </MobileSelector>
    );
  }
}

MBCollaboratorEditor.propTypes = {
  value: PropTypes.array.isRequired,
  column: PropTypes.object.isRequired,
  collaborators: PropTypes.array.isRequired,
  onCommit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

export default MBCollaboratorEditor;
