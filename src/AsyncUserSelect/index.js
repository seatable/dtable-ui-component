import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ModalPortal from '../ModalPortal';
import DTableCustomizeSearchInput from '../DTableCustomizeSearchInput';
import UserItem from './user-item';
import { getLocale } from '../lang';
import keyCodes from '../constants/key-codes';
import DTableIcon from '../DTableIcon';

import './index.css';

const AsyncUserSelect = ({ className, emptyPlaceholder = '', searchPlaceholder = '', isMulti = true, enableShowIDInOrgWhenSearchUser = false, selectedUsers = [], loadOptions, modifySelectedUsers, showDeptBtn = false }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [maxItemNum, setMaxItemNum] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const [popoverPosition, setPopoverPosition] = useState(null);

  const selectorRef = useRef(null);
  const userSelectContainerRef = useRef(null);
  const userListContainerRef = useRef(null);
  const userItemContainerRef = useRef(null);

  const clearStatus = useCallback(() => {
    setSearchedUsers([]);
    setSearchValue('');
    setHighlightIndex(-1);
  }, []);

  const searchUsers = useCallback((searchValue = '') => {
    const trimmedSearchValue = searchValue?.trim() || '';
    if (!trimmedSearchValue) {
      setSearchedUsers([]);
      return;
    }
    loadOptions && loadOptions(searchValue, (options = []) => {
      // [{ email, name, avatar_url }, ...]
      setSearchedUsers(options);
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
    if (!isPopoverOpen) return;
    if (userListContainerRef.current && userItemContainerRef.current) {
      const userItemHeight = userItemContainerRef.current.getBoundingClientRect().height;
      const listMaxHeight = userListContainerRef.current.clientHeight;
      setItemHeight(userItemHeight);
      setMaxItemNum(Math.max(1, Math.floor(listMaxHeight / userItemHeight)));
    }
  }, [isPopoverOpen, searchedUsers]);

  useEffect(() => {
    document.addEventListener('keydown', onHotKey, true);
    return () => {
      document.removeEventListener('keydown', onHotKey, true);
    };
  }, [onHotKey]);

  useEffect(() => {
    if (!isPopoverOpen) return;
    const isInside = (target) => {
      if (!target) return false;
      if (selectorRef.current && selectorRef.current.contains(target)) return true;
      if (userSelectContainerRef.current && userSelectContainerRef.current.contains(target)) return true;
      return false;
    };
    const handleDocumentMouseDown = (e) => {
      if (isInside(e.target)) return;
      setIsPopoverOpen(false);
      clearStatus();
    };
    document.addEventListener('mousedown', handleDocumentMouseDown, true);
    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown, true);
    };
  }, [isPopoverOpen, clearStatus]);

  const getSelectorRect = () => {
    if (!selectorRef.current) return null;
    return selectorRef.current.getBoundingClientRect();
  };

  useLayoutEffect(() => {
    if (!isPopoverOpen) {
      setPopoverPosition(null);
      return;
    }
    const rect = getSelectorRect();
    if (!rect) return;
    setPopoverPosition({
      position: 'fixed',
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }, [isPopoverOpen, selectedUsers]);

  const popoverStyle = popoverPosition;

  return (
    <>
      <div className={classnames('dtable-ui-selected-users-container form-control d-flex align-items-center', className, { 'focus': isPopoverOpen })} onClick={onTogglePopover} ref={selectorRef}>
        <div className='dtable-ui-users-input'>
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
              {emptyPlaceholder || getLocale('Search_users')}
            </div>
          )}
          {!showDeptBtn && <span className="select-dropdown-indicator d-inline-flex align-items-center"><DTableIcon symbol="down" color='var(--bs-icon-color)'/></span>}
        </div>
      </div>
      {isPopoverOpen && popoverStyle && (
        <ModalPortal>
          <div
            className="dtable-ui-user-select-popover dtable-ui-user-select-container"
            ref={userSelectContainerRef}
            style={popoverStyle}
            onMouseDown={e => e.stopPropagation()}
          >
            <div className="seatable-select-search">
              <DTableCustomizeSearchInput
                className="option-search-control"
                placeholder={searchPlaceholder || getLocale('Search_users')}
                onChange={onSearchValueChanged}
                clearValue={() => onSearchValueChanged('')}
                autoFocus={true}
                isClearable={true}
                value={searchValue}
              />
            </div>
            <div className="dtable-ui-user-list-container" ref={userListContainerRef}>
              {searchedUsers.length > 0 && (
                searchedUsers.map((user, index) => {
                  return (
                    <div
                      key={user.email}
                      className={classnames('dtable-ui-user-item-container', { 'dtable-ui-user-item-container-highlight': index === highlightIndex })}
                      ref={index === 0 ? userItemContainerRef : null}
                      onClick={() => onUserClick(user)}
                    >
                      <UserItem key={`dtable-ui-user-selector-searched-user-${index}`} user={user} enableShowIDInOrgWhenSearchUser={enableShowIDInOrgWhenSearchUser} />
                      {selectedUsers.find(u => u.email === user.email) && (
                        <div className='dtable-ui-collaborator-check-icon'>
                          <i className="dtable-font dtable-icon-check" aria-hidden="true"></i>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {searchedUsers.length === 0 && (
                <div className="no-user-search-result">
                  {searchValue ? getLocale('User_not_found') : getLocale('Enter_characters_to_start_searching')}
                </div>
              )}
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
};

AsyncUserSelect.propTypes = {
  className: PropTypes.string,
  emptyPlaceholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  isMulti: PropTypes.bool,
  enableShowIDInOrgWhenSearchUser: PropTypes.bool,
  selectedUsers: PropTypes.array,
  loadOptions: PropTypes.func,
  modifySelectedUsers: PropTypes.func,
  showDeptBtn: PropTypes.bool,
};

export default AsyncUserSelect;
