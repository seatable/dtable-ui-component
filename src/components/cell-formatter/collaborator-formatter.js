import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import CollaboratorItem from '../common/collaborator-item';
import DefaultAvatar from '../../assets/images/avatar/default_avatar.png';

const propTypes = {
  containerClassName: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  collaborators: PropTypes.arrayOf(PropTypes.exact({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    contact_email: PropTypes.string.isRequired,
    avatar_url: PropTypes.string.isRequired,
  })),
  enableDeleteCollaborator: PropTypes.bool,
  onDeleteCollaborator: PropTypes.func,
};

// there will be there conditions
// 1 value is not exist, typeof value is array, but it's length is 0
// 2 value is exist, but can't find in collaborators
// 3 value is exist, typeof value is a string
// 4 value is exist, typeof value is array
class CollaboratorFormatter extends React.PureComponent {

  getValidValue = () => {
    const { value } = this.props;
    if (!value) return [];
    if (!Array.isArray(value)) return [value];
    return value.filter(item => item);
  }

  getCollaborators = (value) => {
    let { collaborators, enableDeleteCollaborator, onDeleteCollaborator } = this.props;

    return value.map((item, index) => {
      let collaborator = collaborators.find(collaborator => collaborator.email === item);
      if (!collaborator) {
        collaborator = {
          name: item,
          avatar_url: DefaultAvatar,
        };
      };
      return (
        <CollaboratorItem 
          key={index}
          collaborator={collaborator} 
          enableDeleteCollaborator={enableDeleteCollaborator}
          onDeleteCollaborator={onDeleteCollaborator}
        />
      );
    });
  }

  render() {
    const { containerClassName } = this.props;
    const className = cn('dtable-ui cell-formatter-container collaborator-formatter', containerClassName);
    const validValue = this.getValidValue();

    if (validValue.length === 0) {
      return (<div className={className}></div>);
    }

    const collaborators = this.getCollaborators(validValue);
    return (
      <div className={className}>
        {collaborators}
      </div>
    );
  }
}

CollaboratorFormatter.propTypes = propTypes;

export default CollaboratorFormatter;
