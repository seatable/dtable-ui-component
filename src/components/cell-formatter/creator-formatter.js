import React from 'react';
import PropTypes from 'prop-types';
import cn from 'astro-classname';
import ColloboratorItem from '../common/collaborator-item';

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

class CreatorFormatter extends React.PureComponent {

  getCollaborators = () => {
    let { value, collaborators } = this.props;
    if (!Array.isArray(value)) {
      value = [value];
    }

    return value.map((item, index) => {
      let collaborator = collaborators.find(collaborator => collaborator.email === item);
      if (!collaborator) {
        return null;
      };
      return (
        <ColloboratorItem key={index} collaborator={collaborator} />
      );
    });
  }

  render() {
    const { containerClassName, value } = this.props;
    const classname = cn('cell-formatter-container collaborator-formatter', containerClassName)
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
