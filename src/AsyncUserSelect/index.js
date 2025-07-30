import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Popover } from 'reactstrap';
import ClickOutside from '../ClickOutside';
import DtableSearchInput from '../DTableSearchInput';
import UserItem from './user-item';
import { getLocale } from '../lang';
import keyCodes from '../constants/key-codes';

import './index.css';

const AsyncUserSelect = ({ className, searchPlaceholder, isMulti = true, selectedUsers = [], loadOptions, modifySelectedUsers }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [maxItemNum, setMaxItemNum] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);

  const selectorRef = useRef(null);
  const userSelectContainerRef = useRef(null);
  const userListContainerRef = useRef(null);
  const userItemContainerRef = useRef(null);

  const clearStatus = useCallback(() => {
    setSearchedUsers([]);
    setSearchValue('');
    setHighlightIndex(-1);
  }, []);

  const onClickOutside = useCallback((e) => {
    if (isPopoverOpen && (!selectorRef.current || !selectorRef.current.contains(e.target))) {
      setIsPopoverOpen(false);
      clearStatus();
    }
  }, [isPopoverOpen, clearStatus]);

  const searchUsers = useCallback((searchValue = '') => {
    const trimmedSearchValue = searchValue?.trim() || '';
    if (!trimmedSearchValue) {
      setSearchedUsers([]);
      setHighlightIndex(-1);
      return;
    }
    loadOptions && loadOptions(searchValue, (options = []) => {
      // [{ email, name, avatar_url }, ...]
      setSearchedUsers(options);
      setHighlightIndex(options.length > 0 ? 0 : -1);
    });
  }, [loadOptions]);

  const onSearchValueChanged = useCallback((newSearchValue) => {
    setSearchValue(newSearchValue);
    searchUsers(newSearchValue);
  }, [searchUsers]);

  const onTogglePopover = useCallback(() => {
    const isOpen = !isPopoverOpen;
    setIsPopoverOpen(isOpen);
    if (!isOpen) {
      clearStatus();
    } else {
      searchUsers('');
    }
  }, [isPopoverOpen, clearStatus, searchUsers]);

  const deselectUser = useCallback((user) => {
    const newSelectedUsers = selectedUsers.filter(item => item.email !== user.email);
    modifySelectedUsers(newSelectedUsers);
  }, [selectedUsers, modifySelectedUsers]);


  const onKeyDown = useCallback((e) => {
    if (e.keyCode === keyCodes.LeftArrow || e.keyCode === keyCodes.RightArrow) {
      e.stopPropagation();
    }
  }, []);

  const selectUser = useCallback((user) => {
    const index = selectedUsers.findIndex(item => item.email === user.email);
    let newSelectedUsers = selectedUsers.slice(0);
    if (isMulti) {
      if (index > -1) {
        newSelectedUsers.splice(index, 1);
      } else {
        newSelectedUsers.push(user);
      }
    } else {
      if (index > -1) {
        newSelectedUsers = [];
      } else {
        newSelectedUsers = [user];
      }
    }
    modifySelectedUsers(newSelectedUsers);
  }, [selectedUsers, isMulti, modifySelectedUsers]);

  const onUserClick = useCallback((user) => {
    selectUser(user);
  }, [selectUser]);

  const onEnter = useCallback((e) => {
    e.preventDefault();
    let user;
    if (searchedUsers.length === 1) {
      user = searchedUsers[0];
    } else if (highlightIndex > -1) {
      user = searchedUsers[highlightIndex];
    }
    if (user) {
      selectUser(user);
    }
  }, [highlightIndex, searchedUsers, selectUser]);

  const onUpArrow = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (highlightIndex > 0) {
      const newHighlightIndex = highlightIndex - 1;
      setHighlightIndex(newHighlightIndex);
      if (newHighlightIndex < searchedUsers.length - maxItemNum) {
        userListContainerRef.current.scrollTop -= itemHeight;
      }
    } else {
      const newHighlightIndex = searchedUsers.length - 1;
      setHighlightIndex(newHighlightIndex);
      userListContainerRef.current.scrollTop = userListContainerRef.current.scrollHeight;
    }
  }, [highlightIndex, maxItemNum, itemHeight, searchedUsers]);

  const onDownArrow = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (highlightIndex < searchedUsers.length - 1) {
      const newHighlightIndex = highlightIndex + 1;
      setHighlightIndex(newHighlightIndex);
      if (newHighlightIndex >= maxItemNum) {
        userListContainerRef.current.scrollTop += itemHeight;
      }
    } else {
      setHighlightIndex(0);
      userListContainerRef.current.scrollTop = 0;
    }
  }, [highlightIndex, maxItemNum, itemHeight, searchedUsers]);

  const onEsc = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPopoverOpen(false);
    clearStatus();
  }, [clearStatus]);

  const onHotKey = useCallback((e) => {
    if (e.keyCode === keyCodes.Enter) {
      onEnter(e);
    } else if (e.keyCode === keyCodes.UpArrow) {
      onUpArrow(e);
    } else if (e.keyCode === keyCodes.DownArrow) {
      onDownArrow(e);
    } else if (e.keyCode === keyCodes.Escape) {
      onEsc(e);
    }
  }, [onEnter, onUpArrow, onDownArrow, onEsc]);

  useEffect(() => {
    if (userSelectContainerRef.current) {
      const { bottom } = userSelectContainerRef.current.getBoundingClientRect();
      if (bottom > window.innerHeight) {
        userSelectContainerRef.current.style.top = `${window.innerHeight - bottom}px`;
      }
    }
    if (userListContainerRef.current && userItemContainerRef.current) {
      const userContainerStyle = getComputedStyle(userListContainerRef.current, null);
      const userItemStyle = getComputedStyle(userItemContainerRef.current, null);
      const userItemHeight = parseInt(userItemStyle.height);
      const maxContainerItemNum = Math.floor(parseInt(userContainerStyle.maxHeight) / userItemHeight);
      setMaxItemNum(maxContainerItemNum);
      setItemHeight(userItemHeight);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onHotKey, true);
    return () => {
      document.removeEventListener('keydown', onHotKey, true);
    };
  }, [onHotKey]);

  return (
    <ClickOutside onClickOutside={onClickOutside}>
      <>
        <div className={classnames('dtable-ui-selected-users-container form-control d-flex align-items-center', className, { 'focus': isPopoverOpen })} onClick={onTogglePopover} ref={selectorRef}>
          {selectedUsers.map((user, index) => {
            return (
              <UserItem
                key={`dtable-ui-user-selector-selected-user-${index}`}
                user={user}
                deleteUser={deselectUser}
              />
            );
          })}
          {selectedUsers.length === 0 && (
            <div className="dtable-ui-user-select-placeholder">
              {searchPlaceholder || getLocale('Search_users')}
            </div>
          )}
        </div>
        {selectorRef.current && (
          <Popover
            placement="bottom-start"
            isOpen={isPopoverOpen}
            target={selectorRef.current}
            hideArrow={true}
            fade={false}
            className="dtable-ui-user-select-popover"
          >
            <div className="dtable-ui-user-select-container" ref={userSelectContainerRef} onMouseDown={e => e.stopPropagation()}>
              <div className="dtable-ui-user-search-container">
                <DtableSearchInput
                  autoFocus
                  placeholder={searchPlaceholder || getLocale('Search_users')}
                  value={searchValue}
                  wait={200}
                  onChange={onSearchValueChanged}
                  onKeyDown={onKeyDown}
                />
              </div>
              <div className="dtable-ui-user-list-container" ref={userListContainerRef}>
                {searchedUsers.length > 0 && (
                  searchedUsers.map((user, index) => {
                    return (
                      <div
                        key={user.email}
                        className={classnames('dtable-ui-user-item-container', { 'dtable-ui-user-item-container-highlight': index === highlightIndex })}
                        ref={userItemContainerRef}
                        onClick={() => onUserClick(user)}
                      >
                        <UserItem key={`dtable-ui-user-selector-searched-user-${index}`} user={user} />
                        {selectedUsers.find(u => u.email === user.email) && (
                          <div className='dtable-ui-collaborator-check-icon'>
                            <i className="dtable-font dtable-icon-check-mark" aria-hidden="true"></i>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                {searchedUsers.length === 0 &&
                  <div className="no-user-search-result">
                    {searchValue ? getLocale('User_not_found') : getLocale('Enter_characters_to_start_searching')}
                  </div>
                }
              </div>
            </div>
          </Popover>
        )}
      </>
    </ClickOutside>
  );
};

AsyncUserSelect.propTypes = {
  className: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  isMulti: PropTypes.bool,
  selectedUsers: PropTypes.array,
  loadOptions: PropTypes.func,
  modifySelectedUsers: PropTypes.func,
};

export default AsyncUserSelect;
