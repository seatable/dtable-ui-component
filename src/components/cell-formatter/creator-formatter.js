import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import ColloboratorItem from '../common/collaborator-item';
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
};

// there will be there conditions
// 1 value is not exist, typeof value is array, but it's length is 0
// 2 value is exist, but can't find in collaborators
// 3 value is exist, typeof value is a string
// 4 vlaue is exist, typeof value is array
class CreatorFormatter extends React.PureComponent {

  getCollaborators = () => {
    let { value, collaborators } = this.props;
    if (!Array.isArray(value)) {
      value = [value];
    }

    return value.map((item, index) => {
      let collaborator = collaborators.find(collaborator => collaborator.email === item);
      // the collaborator can be not exist, beacuse the row created by third app
      if (!collaborator) {
        collaborator = {
          name: item,
          avatar_url: DefaultAvatar,
        };
      };
      return (
        <ColloboratorItem key={index} collaborator={collaborator} />
      );
    });
  }

  render() {
    const { containerClassName, value } = this.props;
    const classname = cn('cell-formatter-container ceator-formatter', containerClassName)
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return (<div className={classname}></div>)
    }

    const collaborators = this.getCollaborators();
    return (
      <div className={classname}>
        {collaborators}
      </div>
    );
  }
}

CreatorFormatter.propTypes = propTypes;

export default CreatorFormatter;
