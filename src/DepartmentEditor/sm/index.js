import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { List } from 'antd-mobile';
import DTableRadio from '../../DTableRadio';
import MobileFullScreenPage from '../../MobileFullScreenPage';
import { getNormalizedDepartments } from '../utils';
import { DEPARTMENT_SELECT_RANGE_MAP, DEPARTMENT_SELECT_RANGE_OPTIONS } from '../constants';
import { getLocale } from '../../lang';

import './index.css';

const Item = List.Item;

const Small = ({
  value: oldValue,
  column,
  isSupportMultiple = false,
  isFilterEditor = false,
  userDepartmentIdsMap = {},
  departments: initialDepartments = [],
  onCommit,
  onClose,
}) => {
  const [value, setValue] = useState(oldValue ? oldValue : isSupportMultiple ? [] : '');
  const [departments, setDepartments] = useState([]);
  const [parentId, setParentId] = useState('');
  const [topParentIds, setTopParentIds] = useState([]);

  const initColumnData = useMemo(() => {
    const data = column.data || {};
    const enableSelectRange = data.enable_select_range || false;
    const selectedRange = data.selected_range || '';
    const specificDepartments = data.specific_departments || [];
    return { enableSelectRange, selectedRange, specificDepartments };
  }, [column]);

  const onSave = useCallback(() => {
    !isFilterEditor && onCommit && onCommit(value);
    onClose && onClose();
  }, [isFilterEditor, value, onCommit, onClose]);

  const onDepartmentClick = useCallback((event, department) => {
    event.preventDefault();
    const { id, hasChild } = department;
    if (event.target && event.target.className.indexOf('am-list-arrow') > -1) {
      if (!hasChild) return;
      setParentId(id);
      return;
    }
    let newValue;
    if (isSupportMultiple) {
      newValue = value.slice(0);
      const index = newValue.indexOf(id);
      index === -1 ? newValue.push(id) : newValue.splice(index);
    } else {
      newValue = id === value ? '' : id;
    }
    if (isFilterEditor) {
      onCommit && onCommit({ id });
    }
    setValue(newValue);
  }, [isSupportMultiple, isFilterEditor, value, onCommit]);

  const onParentDepartmentClick = useCallback((event, type) => {
    event.preventDefault();
    let newValue;
    if (isSupportMultiple) {
      newValue = value.slice(0);
      const index = newValue.indexOf(type);
      index === -1 ? newValue.push(type) : newValue.splice(index);
    } else {
      newValue = type === value ? '' : type;
    }
    if (isFilterEditor) {
      onCommit && onCommit({ id: type });
    }
    setValue(newValue);
  }, [value, isFilterEditor, isSupportMultiple, onCommit]);

  const onLeftClick = useCallback(() => {
    const parentDepartment = departments.find(item => item.id === parentId);
    if (!parentDepartment) {
      onClose && onClose();
      return;
    }
    const { enableSelectRange } = initColumnData;
    if (topParentIds.includes(parentId) && enableSelectRange) {
      setParentId('');
      return;
    }
    const upperLevelDepartmentParentId = parentDepartment.parent_id;
    setParentId(upperLevelDepartmentParentId);
  }, [initColumnData, departments, parentId, topParentIds, onClose]);

  const renderLeftContent = useCallback(() => {
    const parentDepartment = departments.find(item => item.id === parentId);
    if (!parentDepartment && !isFilterEditor) return getLocale('Cancel');
    return (<i aria-hidden="true" className="dtable-font dtable-icon-return"></i>);
  }, [isFilterEditor, departments, parentId]);

  const renderDepartments = useCallback(() => {
    const { enableSelectRange } = initColumnData;
    let currentDepartments = [];
    if (enableSelectRange && !parentId && !isFilterEditor) {
      currentDepartments = departments.filter(department => topParentIds.includes(department.id));
    } else {
      currentDepartments = departments.filter(department => department.parent_id === parentId);
    }
    if (currentDepartments.length === 0) {
      return (
        <div className="d-flex justify-content-center seatable-tip-default h-100 w-100 align-items-center">
          <span>{getLocale('No_departments_available')}</span>
        </div>
      );
    }

    return (
      <List className="my-list mobile-dtable-ui-department-editor-departments" renderHeader={() => getLocale('Select_department')}>
        {isFilterEditor && parentId === -1 && (
          <>
            {DEPARTMENT_SELECT_RANGE_OPTIONS.slice(0, 2).map((option, index) => {
              const { type, name } = option;
              const isChecked = isSupportMultiple ? value.includes(type) : value === type;
              return (
                <Item
                  key={`department-range-item-${index}`}
                  multipleLine
                  onClick={(event) => onParentDepartmentClick(event, type)}
                  className="mobile-dtable-ui-department-editor-department-item"
                >
                  <div className="d-flex">
                    <DTableRadio
                      isChecked={isChecked}
                      onCheckedChange={(event) => onParentDepartmentClick(event, type)}
                      label={getLocale(name)}
                    />
                  </div>
                </Item>
              );
            })}
          </>
        )}
        {currentDepartments.map((department, index) => {
          const { hasChild, name, id } = department;
          const isChecked = isSupportMultiple ? value.includes(id) : value === id;
          return (
            <Item
              arrow={hasChild ? 'horizontal' : ''}
              key={`department-item-${index}`}
              multipleLine
              onClick={(event) => onDepartmentClick(event, department)}
              className="mobile-dtable-ui-department-editor-department-item"
            >
              <div className="d-flex">
                <DTableRadio
                  isChecked={isChecked}
                  onCheckedChange={(event) => onParentDepartmentClick(event, department)}
                  label={name}
                />
              </div>
            </Item>
          );
        })}
      </List>
    );
  }, [initColumnData, parentId, isFilterEditor, isSupportMultiple, departments, value, topParentIds, onParentDepartmentClick, onDepartmentClick]);

  useEffect(() => {
    const { enableSelectRange, selectedRange, specificDepartments } = initColumnData;
    if (enableSelectRange && !isFilterEditor) {
      const { current_user_department_ids = [], current_user_department_and_sub_ids = [] } = userDepartmentIdsMap;
      const { departments: initialDepartments } = window.app.state;
      let targetDepartments = [];
      let topParentIds = [];
      let canExpand = true;
      if (selectedRange === DEPARTMENT_SELECT_RANGE_MAP.CURRENT_USER_DEPARTMENT) {
        canExpand = false;
        topParentIds = current_user_department_ids;
        targetDepartments = initialDepartments.filter(department => current_user_department_ids.includes(department.id));
      } else if (selectedRange === DEPARTMENT_SELECT_RANGE_MAP.CURRENT_USER_DEPARTMENT_AND_SUB) {
        const currentUserDepartments = initialDepartments.filter(department => current_user_department_ids.includes(department.id));
        topParentIds = currentUserDepartments.filter(department =>
          !current_user_department_ids.includes(department.parent_id)).map(department => department.id);
        targetDepartments = initialDepartments.filter(department => current_user_department_and_sub_ids.includes(department.id));
      } else {
        canExpand = false;
        topParentIds = specificDepartments;
        targetDepartments = initialDepartments.filter(department => specificDepartments.includes(department.id));
      }
      const departments = getNormalizedDepartments(targetDepartments, canExpand);
      setDepartments(departments);
      setTopParentIds(topParentIds);
      return;
    }
    const departments = getNormalizedDepartments(initialDepartments);
    setDepartments(departments);
    setParentId(-1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MobileFullScreenPage className="mobile-dtable-ui-department-editor" onLeftClick={onLeftClick} onRightClick={onSave} onClose={onClose}>
      <>{renderLeftContent()}</>
      <>{column.name}</>
      <>{isFilterEditor ? null : (<span style={{ color: '#f09f3f' }}>{getLocale('Submit')}</span>)}</>
      <>
        {renderDepartments()}
      </>
    </MobileFullScreenPage>
  );
};

export default Small;
