import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'reactstrap';
import { searchCollaborators } from 'dtable-utils';
import { getLocale } from '../../../../lang';
import CollaboratorItem from '../../../../CollaboratorItem';

import './index.css';

class ParticipantSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      participants: props.participants || [],
      searchVal: ''
    };
  }

  componentDidMount() {
    let collaboratorListHeight = this.participantsRef.offsetHeight;
    this.participantsRef.style.top = `${-collaboratorListHeight + 10}px`;
    this.registerHandlers();
  }

  componentDidUpdate() {
    let collaboratorListHeight = this.participantsRef.offsetHeight;
    this.participantsRef.style.top = `${-collaboratorListHeight + 10}px`;
  }

  componentWillUnmount() {
    this.unregisterHandlers();
  }

  registerHandlers = () => {
    document.addEventListener('mousedown', this.handleOutsideClick);
  };

  unregisterHandlers = () => {
    document.removeEventListener('mousedown', this.handleOutsideClick);
  };

  handleOutsideClick = (e) => {
    if (!this.participantsRef.contains(e.target)) {
      this.unregisterHandlers();
      if (e.target.className === 'dtable-ui-participants-add' || e.target.parentNode.className === 'dtable-ui-participants-add') {
        return;
      }
      this.props.onClose();
    }
  };

  getFilteredParticipants = () => {
    let { collaborators } = window.app.state;
    let { searchVal } = this.state;
    return searchCollaborators(collaborators, searchVal);
  };

  removeParticipant = (participant) => {
    let { participants } = this.state;
    let updatedValue = participants.slice(0);
    let participant_index = participants.findIndex(participantItem => participantItem.email === participant.email);
    updatedValue.splice(participant_index, 1);
    this.props.onChange(updatedValue);
    this.setState({ participants: updatedValue });
  };

  onChangeSearch = (event) => {
    let { searchVal } = this.state;
    if (searchVal === event.target.value) {
      return;
    }
    searchVal = event.target.value;
    this.setState({ searchVal });
  };

  onSelectParticipant = (participant) => {
    let { participants } = this.state;
    participants = participants.slice(0);
    let participant_index = participants.findIndex(participantItem => participantItem.email === participant.email);
    if (participant_index > -1) {
      participants.splice(participant_index, 1);
    } else {
      participants.push(participant);
    }
    this.props.onChange(participants);
    this.setState({ participants });
  };

  renderMenuContent = () => {
    let { participants } = this.state;
    let filteredParticipants = this.getFilteredParticipants();
    if (filteredParticipants.length > 0) {
      return filteredParticipants.map((participant) => {
        let selectedIndex = participants.findIndex(item => item.email === participant.email);
        return (
          <div key={participant.email} className="dropdown-item dtable-ui-participant-item" onClick={this.onSelectParticipant.bind(this, participant)}>
            <div className="dtable-ui-participant-container">
              <div className="dtable-ui-participant">
                <img className="dtable-ui-participant-avatar" alt={participant.name} src={participant.avatar_url} />
                <span className="dtable-ui-participant-name text-truncate">{participant.name}</span>
              </div>
              <div className="dtable-ui-participant-check-icon">
                {selectedIndex > -1 && <i aria-hidden="true" className="dtable-font dtable-icon-check-mark"></i>}
              </div>
            </div>
          </div>
        );
      });
    } else {
      return (
        <span className="none-search-result">{getLocale('No_collaborators_available')}</span>
      );
    }
  };

  renderParticipantList() {
    const { collaborators } = this.props;
    const selectedParticipants = collaborators.filter(item => {
      return this.state.participants.find(participant => participant.email === item.email);
    });
    if (selectedParticipants.length === 0) return null;
    return (
      <div className="dtable-ui-participants-editor-header">
        {selectedParticipants.map((participant) => {
          return (
            <CollaboratorItem
              key={participant.email}
              collaborator={participant}
              className="dtable-ui-participant"
              enableDeleteCollaborator={true}
              onDeleteCollaborator={this.removeParticipant}
            />
          );
        })}
      </div>
    );
  }

  render() {
    const { target } = this.props;

    return (
      <div ref={ref => this.outerRef = ref}>
        <Popover placement="top" isOpen={true} target={target} fade={false} hideArrow={true}>
          <div className="dropdown-menu dtable-ui-participants-editor show m-0 p-0" ref={ref => this.participantsRef = ref}>
            {this.renderParticipantList()}
            <div className="dtable-ui-participants-editor-search">
              <input className="form-control" type="text" placeholder={getLocale('Search_collaborator')} value={this.state.searchVal} onChange={this.onChangeSearch}/>
            </div>
            <div className="dtable-ui-participants-editor-participants-container">
              {this.renderMenuContent()}
            </div>
          </div>
        </Popover>
      </div>
    );
  }
}

ParticipantSelect.propTypes = {
  participants: PropTypes.array,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
};

export default ParticipantSelect;
