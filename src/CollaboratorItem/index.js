import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.css';

const propTypes = {
  collaborator: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar_url: PropTypes.string.isRequired,
    email: PropTypes.string,
  }),
  className: PropTypes.string,
  enableDeleteCollaborator: PropTypes.bool,
  onDeleteCollaborator: PropTypes.func,
};

class CollaboratorItem extends React.Component {

  static defaultProps = {
    enableDelete: false
  };

  onDeleteCollaborator = (event) => {
    event.stopPropagation();
    event && event.nativeEvent.stopImmediatePropagation();
    this.props.onDeleteCollaborator(this.props.collaborator);
  };

  render() {
    const { className, collaborator, enableDeleteCollaborator } = this.props;
    return (
      <div title={collaborator.name} className={classnames('dtable-ui collaborator-item', className)}>
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
