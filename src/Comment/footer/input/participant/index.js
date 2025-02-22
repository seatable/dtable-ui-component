import React from 'react';
import PropTypes from 'prop-types';

class Participant extends React.Component {

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.showParticipantActiveIndex === this.props.participantIndex
      && nextProps.showParticipantActiveIndex !== this.props.showParticipantActiveIndex
    ) {
      let offsetHeight = this.participantItem.offsetHeight;
      let offsetTop = this.participantItem.offsetTop;
      if (nextProps.showParticipantActiveIndex > this.props.showParticipantActiveIndex) {
        this.props.setScrollTop(offsetTop, offsetHeight, 'down');
      } else {
        this.props.setScrollTop(offsetTop, offsetHeight, 'up');
      }
    }
  }

  onSelect = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.onSelect();
  };

  render() {
    const { participant, index, activeIndex } = this.props;
    const active = index === activeIndex;
    return (
      <div
        className={`comment-participant-item ${active ? 'active' : ''}`}
        ref={ref => this.participantItem = ref}
        onClick={this.onSelect}
      >
        <div className="comment-participant-container">
          <div className="comment-participant text-truncate">
            <img className="comment-dtable-ui-participant-avatar ml-2" alt={participant.name} src={participant.avatar_url} />
            <span className="comment-participant-name">{participant.name}</span>
          </div>
        </div>
      </div>
    );
  }
}

Participant.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  participant: PropTypes.object.isRequired,
  setScrollTop: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default Participant;
