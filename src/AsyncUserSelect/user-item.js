import { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getLocale } from '../lang';

const UserItem = ({ className, user, deleteUser }) => {
  const name = useMemo(() => user?.name || '', [user]);
  const avatarUrl = useMemo(() => user?.avatar_url || '', [user]);

  const onDeleteUser = (event) => {
    event.stopPropagation();
    event && event.nativeEvent.stopImmediatePropagation();
    deleteUser(user);
  };

  return (
    <div className={classnames('dtable-ui-user-item', className)} title={name} aria-label={name}>
      <span className="user-avatar">
        <img className="user-avatar-icon" alt={name} src={avatarUrl} />
      </span>
      <span className="user-name text-truncate">{name}</span>
      {deleteUser && (
        <span className="user-remove ml-2" onClick={onDeleteUser} title={getLocale('Remove')}>
          <i className="dtable-font dtable-icon-x" aria-hidden="true"></i>
        </span>
      )}
    </div>
  );
};

UserItem.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  deleteUser: PropTypes.func,
};

export default UserItem;
