import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FILTER_PREDICATE_TYPE } from 'dtable-utils';
import CollaboratorSelect from '../../../DTableCustomizeCollaboratorSelect';
import { getLocale } from '../../../lang';

import './index.css';

class CollaboratorFilter extends Component {

  constructor(props) {
    super(props);
    this.supportMultipleSelectOptions = [
      FILTER_PREDICATE_TYPE.HAS_ANY_OF,
      FILTER_PREDICATE_TYPE.HAS_ALL_OF,
      FILTER_PREDICATE_TYPE.HAS_NONE_OF,
      FILTER_PREDICATE_TYPE.IS_EXACTLY,
    ];
  }

  createCollaboratorOptions = (filterIndex, collaborators, filterTerm) => {
    return collaborators.map((collaborator) => {
      let isSelected = filterTerm.findIndex(item => item === collaborator.email) > -1;
      return {
        value: { filterIndex, columnOption: collaborator },
        name: collaborator.name,
        name_pinyin: collaborator.name_pinyin,
        label: (
          <div className="select-option-name option-collaborator">
            <div className="collaborator-container">
              <div className="collaborator">
                <span className="collaborator-avatar-container">
                  <img className="collaborator-avatar" alt={collaborator.name} src={collaborator.avatar_url} />
                </span>
                <span
                  className="collaborator-name text-truncate"
                  style={{maxWidth: '200px'}}
                  title={collaborator.name}
                  aria-label={collaborator.name}
                >{collaborator.name}</span>
              </div>
            </div>
            <div className='collaborator-check-icon'>
              {isSelected && <i className="option-edit dtable-font dtable-icon-check-mark"></i>}
            </div>
          </div>
        )
      };
    });
  }

  onClick = (e, collaborator) => {
    e.stopPropagation();
    this.props.onSelectCollaborator({ columnOption: collaborator });
  }

  render() {
    let { filterIndex, filterTerm, collaborators, placeholder, filter_predicate } = this.props;
    let isSupportMultipleSelect = this.supportMultipleSelectOptions.indexOf(filter_predicate) > -1 ? true : false;
    let selectedCollaborators = Array.isArray(filterTerm) && filterTerm.length > 0 && filterTerm.map((item) => {
      let collaborator = collaborators.find(c => c.email === item);
      if (!collaborator) return null;
      return (
        <div key={item} className="collaborator">
          <span className="collaborator-avatar-container">
            <img className="collaborator-avatar" alt={collaborator.name} src={collaborator.avatar_url} />
          </span>
          <span
            className="collaborator-name text-truncate"
            title={collaborator.name}
            aria-label={collaborator.name}
          >{collaborator.name}</span>
          <span className="remove-container">
            <span className="remove-icon" onClick={(e) => {this.onClick(e, collaborator);}}>
              <i className="dtable-font dtable-icon-fork-number"></i>
            </span>
          </span>
        </div>
      );
    });
    let value = selectedCollaborators ? {label: (<>{selectedCollaborators}</>)} : {};
    let options = Array.isArray(filterTerm) ? this.createCollaboratorOptions(filterIndex, collaborators, filterTerm) : [];
    return (
      <CollaboratorSelect
        className="selector-collaborator"
        value={value}
        onSelectOption={this.props.onSelectCollaborator}
        options={options}
        placeholder={placeholder}
        isLocked={this.props.isReadonly}
        supportMultipleSelect={isSupportMultipleSelect}
        searchable={true}
        searchPlaceholder={getLocale('Find_a_collaborator')}
        isUsePopover={false}
      />
    );
  }
}

CollaboratorFilter.propTypes = {
  isReadonly: PropTypes.bool,
  filterIndex: PropTypes.number,
  filterTerm: PropTypes.oneOfType([PropTypes.array, PropTypes.string]), // Make the current bug execution the correct code, this can restore in this Component
  filter_predicate: PropTypes.string, 
  collaborators: PropTypes.array,
  onSelectCollaborator: PropTypes.func,
  placeholder: PropTypes.string,
};

export default CollaboratorFilter;
