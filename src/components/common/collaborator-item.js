import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  collaborator: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar_url: PropTypes.string.isRequired,
    email: PropTypes.string,
  }),
  enableDeleteCollaborator: PropTypes.bool,
  onDeleteCollaborator: PropTypes.func,
};

class CollaboratorItem extends React.Component {

  static defaultProps = {
    enableDelete: false
  }

  onDeleteCollaborator = () => {
    let  { collaborator } = this.props;
    this.props.onDeleteCollaborator(collaborator);
  }

  render() {
    const { collaborator, enableDeleteCollaborator } = this.props;
    return (
      <div className="dtable-ui collaborator-item">
        <span className="collaborator-avatar">
          <img className="collaborator-avatar-icon" alt={collaborator.name} src={collaborator.avatar_url} />
        </span>
        <span className="collaborator-name">{collaborator.name}</span>
        {enableDeleteCollaborator && (
          <span className="collaborator-remove" onClick={this.onDeleteCollaborator}>
            <i className="dtable-font dtable-icon-fork-number"></i>
          </span>
        )}
      </div>
    );
  }
}

CollaboratorItem.propTypes = propTypes;

export default CollaboratorItem;
