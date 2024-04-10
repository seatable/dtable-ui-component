import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { DEPARTMENT_SELECT_RANGE_MAP } from 'dtable-utils';
import Loading from '../Loading';
import { getNormalizedDepartments, searchDepartments } from './utils';
import { getLocale } from '../lang';

const propTypes = {
  enableSelectRange: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userDepartmentIdsMap: PropTypes.object,
  departments: PropTypes.array,
  menuStyle: PropTypes.object,
  column: PropTypes.object,
  renderUserDepartmentOptions: PropTypes.func,
  onCommit: PropTypes.func,
};

class DepartmentSingleSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
      departments: [],
      topParentIds: [],
      isLoading: false,
    };
    this.validDepartments = [];
  }

  componentDidMount() {
    // Make sure child component is rendered, so current component can be stretched out, then get the correct size
    setTimeout(() => {
      this.resetMenuStyle();
    }, 1);
    const { enableSelectRange, userDepartmentIdsMap, departments } = this.props;
    if (enableSelectRange) {
      this.initRangeDepartments(userDepartmentIdsMap, departments);
    } else {
      this.initDepartments(departments);
    }
  }

  resetMenuStyle = () => {
    if (!this.departmentsRef) return;
    const { bottom } = this.departmentsRef.getBoundingClientRect();
    if (bottom > window.innerHeight) {
      this.departmentsRef.style.top = (parseInt(this.departmentsRef.style.top) - bottom + window.innerHeight) + 'px';
    }
  };

  initDepartments = (departments) => {
    const normalizedDepartments = getNormalizedDepartments(departments || []);
    this.validDepartments = normalizedDepartments;
    this.setState({ departments: normalizedDepartments });
  };

  initRangeDepartments = (userDepartmentIdsMap, departments = []) => {
    const { selectedRange, specificDepartments } = this.getSelectedRange();
    const { current_user_department_ids = [], current_user_department_and_sub_ids = [] } = userDepartmentIdsMap || {};
    let targetDepartments = [];
    let topParentIds = [];
    if (selectedRange === DEPARTMENT_SELECT_RANGE_MAP.CURRENT_USER_DEPARTMENT) {
      topParentIds = current_user_department_ids;
      targetDepartments = departments.filter(department => current_user_department_ids.includes(department.id));
    } else if (selectedRange === DEPARTMENT_SELECT_RANGE_MAP.CURRENT_USER_DEPARTMENT_AND_SUB) {
      const currentUserDepartments = departments.filter(department => current_user_department_ids.includes(department.id));
      topParentIds = currentUserDepartments.filter(department =>
        !current_user_department_ids.includes(department.parent_id)).map(department => department.id);
      targetDepartments = departments.filter(department => current_user_department_and_sub_ids.includes(department.id));
    } else {
      targetDepartments = departments.filter(department => specificDepartments.includes(department.id));
    }
    const normalizedDepartments = getNormalizedDepartments(targetDepartments);
    this.validDepartments = normalizedDepartments;
    this.setState({ departments: normalizedDepartments, topParentIds });
  };

  getSelectedRange = () => {
    const { column } = this.props;
    const data = column.data || {};
    const selectedRange = data.selected_range || '';
    const specificDepartments = data.specific_departments || [];
    return { selectedRange, specificDepartments };
  };

  onExpand = (event, id, isExpanded) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    let newDepartments = this.state.departments.slice(0);
    const index = newDepartments.findIndex(item => item.id === id);
    newDepartments[index].isExpanded = !isExpanded;
    this.setState({ departments: newDepartments });
  };

  onChangeSearch = (event) => {
    const newSearchValue = event.target.value;
    const { searchVal } = this.state;
    if (searchVal === newSearchValue) return;
    const { departments } = this.state;
    this.validDepartments = searchDepartments(departments, newSearchValue);
    this.setState({ searchVal: newSearchValue });
  };

  onSelectDepartment = (event, selectedValue) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    const { onCommit, value } = this.props;
    const newValue = selectedValue === value ? '' : selectedValue;
    onCommit(newValue);
  };

  onStopPropagation = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  renderSubDepartments = (id, subDepartments, level) => {
    const topDepartments = subDepartments.filter(department => department.parent_id === id);
    const newSubDepartments = subDepartments.filter(department => department.parent_id !== id);
    if (topDepartments.length === 0) return null;
    const topDepartmentsId = topDepartments.map(department => department.id);
    const nextLevelDepartment = subDepartments.find(department => topDepartmentsId.includes(department.parent_id));
    const hasNextLevel = !!nextLevelDepartment;
    return (
      topDepartments.map((department) => {
        return this.renderDepartment(department, newSubDepartments, level, hasNextLevel);
      })
    );
  };

  renderDepartment = (department, subDepartments, level, hasNextLevel) => {
    const { value } = this.props;
    const newLevel = level + 1;
    const { hasChild, isExpanded, name, id } = department;
    const noChildStyle = hasNextLevel ? '16px' : '12px';
    const nameStyle = { paddingLeft: hasChild ? '' : noChildStyle };
    const itemStyle = { paddingLeft: `${(newLevel) * 15 + 10}px` };
    const isChecked = value === id;

    return (
      <Fragment key={id}>
        <div
          className="dropdown-item department-item d-flex align-items-center"
          onClick={(event) => this.onSelectDepartment(event, id)}
          style={itemStyle}
        >
          <div className="department-item-left-content d-flex align-items-center">
            {hasChild &&
              <span
                className={`dtable-font expand dtable-icon-${isExpanded ? 'drop-down' : 'right-slide'} pr-1`}
                onClick={(event) => this.onExpand(event, id, isExpanded)}
              ></span>
            }
            <span style={nameStyle} title={name} className="text-truncate department-name">{name}</span>
            {isChecked &&
              <span className="department-check-icon">
                <i className="dtable-font dtable-icon-check-mark"></i>
              </span>
            }
          </div>
        </div>
        {(isExpanded && hasChild) && this.renderSubDepartments(id, subDepartments, newLevel)}
      </Fragment>
    );
  };

  renderAllDepartments = () => {
    const { departments } = this.state;
    const topDepartment = departments.find(department => department.parent_id === -1);
    const subDepartments = departments.filter(department => department.parent_id !== -1);
    return (
      <>
        {topDepartment ? this.renderDepartment(topDepartment, subDepartments, -1, true)
          : this.renderEmptyTip()
        }
      </>
    );
  };

  renderSpecificDepartments = () => {
    const { departments } = this.state;
    return (
      <>
        {this.validDepartments.length === 0 && this.renderEmptyTip()}
        {this.validDepartments.length > 0 && this.validDepartments.map(department => {
          const value = { ...department, hasChild: false };
          return this.renderDepartment(value, departments, -1, false);
        })}
      </>
    );
  };

  renderCurrentDepartmentsAndSub = () => {
    const { departments, topParentIds } = this.state;
    const nextLevelDepartment = this.validDepartments.find(department => topParentIds.includes(department.parent_id));
    const hasNextLevel = !!nextLevelDepartment;
    return (
      <>
        {this.validDepartments.length === 0 && this.renderEmptyTip()}
        {this.validDepartments.length > 0 && this.validDepartments.map(department => {
          let value = department;
          if (!topParentIds.includes(department.id)) return null;
          return this.renderDepartment(value, departments, -1, hasNextLevel);
        })}
      </>
    );
  };

  renderEmptyTip = () => {
    return (
      <span className="none-search-result d-flex justify-content-center">
        {getLocale('No_departments_available')}
      </span>
    );
  };

  renderMenuContent = () => {
    const { searchVal } = this.state;
    const { enableSelectRange, renderUserDepartmentOptions } = this.props;
    const { selectedRange } = this.getSelectedRange();
    let menuContent = this.renderAllDepartments();
    if ((enableSelectRange && [DEPARTMENT_SELECT_RANGE_MAP.CURRENT_USER_DEPARTMENT, DEPARTMENT_SELECT_RANGE_MAP.SPECIFIC_DEPARTMENTS]
      .includes(selectedRange)) || searchVal) {
      menuContent = this.renderSpecificDepartments();
    } else if (enableSelectRange && selectedRange === DEPARTMENT_SELECT_RANGE_MAP.CURRENT_USER_DEPARTMENT_AND_SUB) {
      menuContent = this.renderCurrentDepartmentsAndSub();
    }
    return (
      <div
        className="editor-department-container"
        ref={(ref) => this.departmentContainerRef = ref}
      >
        {!searchVal && renderUserDepartmentOptions && renderUserDepartmentOptions(this.onSelectDepartment)}
        {menuContent}
      </div>
    );
  };

  render() {
    return (
      <div
        className="dropdown-menu department-editor-list dtable-ui show m-0 p-0"
        style={this.props.menuStyle}
        ref={ref => this.departmentsRef = ref}
        onClick={this.onStopPropagation}
        onMouseDown={this.onStopPropagation}
      >
        <div className="search-departments">
          <input
            className="form-control"
            type="text"
            autoFocus
            placeholder={getLocale('Search_department')}
            value={this.state.searchVal}
            onChange={this.onChangeSearch}
            onClick={this.onStopPropagation}
          />
        </div>
        {this.state.isLoading ? <div className="mt-4"><Loading /></div> : this.renderMenuContent()}
      </div>
    );
  }
}

DepartmentSingleSelect.propTypes = propTypes;

export default DepartmentSingleSelect;
