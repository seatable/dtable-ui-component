import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from 'reactstrap';
import Participant from './participant';
import ParticipantSelect from './participant-select';
import { getLocale } from '../../../lang';

import './index.css';

class Participants extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showParticipantSelect: false,
    };
  }

  closeParticipantSelect = () => {
    this.setState({ showParticipantSelect: false });
  };

  toggleParticipantSelect = () => {
    this.setState({ showParticipantSelect: !this.state.showParticipantSelect });
  };

  render() {
    const { canUpdate, participants, collaborators } = this.props;
    return (
      <div className="dtable-ui-comments-participants mb-2 position-relative" ref={ref => this.ref = ref}>
        {participants.map((participant) => {
          return (<Participant participant={participant} key={participant.email}/>);
        })}
        {canUpdate && (
          <span className="dtable-ui-participants-add" onClick={this.toggleParticipantSelect} ref={ref => this.addIcon = ref}>
            <i aria-hidden="true" className="dtable-font dtable-icon-add"></i>
          </span>
        )}
        {this.addIcon && (
          <UncontrolledTooltip delay={{ show: 0, hide: 0 }} target={this.addIcon} placement="bottom">
            {getLocale('Add_participants')}
          </UncontrolledTooltip>
        )}
        {this.ref && this.state.showParticipantSelect && (
          <ParticipantSelect
            target={this.ref}
            participants={participants}
            collaborators={collaborators}
            onChange={this.props.onChange}
            onClose={this.closeParticipantSelect}
          />
        )}
      </div>
    );
  }
}

Participants.propTypes = {
  canUpdate: PropTypes.bool,
  showIconTip: PropTypes.bool.isRequired,
  participants: PropTypes.array,
  collaborators: PropTypes.array,
  onChange: PropTypes.func,
};

export default Participants;
