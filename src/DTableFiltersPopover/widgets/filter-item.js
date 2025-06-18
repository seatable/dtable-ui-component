import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';
import {
  CellType,
  COLLABORATOR_COLUMN_TYPES,
  DATE_COLUMN_OPTIONS,
  FORMULA_RESULT_TYPE,
  FILTER_PREDICATE_TYPE,
  FILTER_TERM_MODIFIER_TYPE,
  filterTermModifierIsWithin,
  isDateColumn,
  FILTER_ERR_MSG,
} from 'dtable-utils';
import DTableCustomizeSelect from '../../DTableCustomizeSelect';
import DtableSearchInput from '../../DTableSearchInput';
import CollaboratorFilter from './collaborator-filter';
import DepartmentSingleSelectFilter from './department-select-filter/department-single-select-filter';
import DepartmentMultipleSelectFilter from './department-select-filter/department-multiple-select-filter';
import RateItem from './rate-item';
import FilterCalendar from './filter-calendar';
import CheckboxEditor from '../../CheckboxEditor';
import NumberEditor from '../../NumberEditor';
import DurationEditor from '../../DurationEditor';
import FilterItemUtils from '../utils/filter-item-utils';
import {
  getFilterByColumn, getUpdatedFilterBySelectSingle, getUpdatedFilterBySelectMultiple,
  getUpdatedFilterByCreator, getUpdatedFilterByCollaborator, getColumnOptions, getUpdatedFilterByPredicate, generateDefaultUser
} from '../utils';
import { DELETED_OPTION_BACKGROUND_COLOR, DELETED_OPTION_TIPS, EMPTY_PREDICATE, INPUT_CMP_TYPE_MAP } from '../constants';
import { isCheckboxColumn } from '../../utils/column-utils';
import { getLocale } from '../../lang';

const propTypes = {
  index: PropTypes.number.isRequired,
  isInModal: PropTypes.bool,
  userDepartmentIdsMap: PropTypes.object,
  departments: PropTypes.array,
  lang: PropTypes.string,
  filter: PropTypes.object.isRequired,
  filterColumn: PropTypes.object.isRequired,
  filterConjunction: PropTypes.string.isRequired,
  conjunctionOptions: PropTypes.array.isRequired,
  filterColumnOptions: PropTypes.array.isRequired,
  deleteFilter: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  updateConjunction: PropTypes.func.isRequired,
  collaborators: PropTypes.array,
  errMsg: PropTypes.string,
  firstDayOfWeek: PropTypes.string,
};


class FilterItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filterTerm: props.filter.filter_term,
      enterRateItemIndex: 0,
    };
    this.filterPredicateOptions = null;
    this.filterTermModifierOptions = null;
    this.filterToolTip = React.createRef();
    this.invalidFilterTip = React.createRef();

    this.initSelectOptions(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { filter } = this.props;
    if (nextProps.filter !== filter) {
      this.initSelectOptions(nextProps);
      this.setState({
        filterTerm: nextProps.filter.filter_term,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const currentProps = this.props;
    const shouldUpdated = (
      nextProps.index !== currentProps.index ||
      nextProps.filter !== currentProps.filter ||
      nextProps.filterColumn !== currentProps.filterColumn ||
      nextProps.filterConjunction !== currentProps.filterConjunction ||
      nextProps.conjunctionOptions !== currentProps.conjunctionOptions ||
      nextProps.filterColumnOptions !== currentProps.filterColumnOptions
    );
    return shouldUpdated;
  }

  initSelectOptions = (props) => {
    const { filter, filterColumn } = props;
    let { filterPredicateList, filterTermModifierList } = getColumnOptions(filterColumn);
    // The value of the calculation formula column does not exist in the shared view
    this.filterPredicateOptions = filterPredicateList ? filterPredicateList.map(predicate => {
      return FilterItemUtils.generatorPredicateOption(predicate);
    }).filter(item => item) : [];

    const { filter_predicate } = filter;
    if (isDateColumn(filterColumn)) {
      if (filter_predicate === FILTER_PREDICATE_TYPE.IS_WITHIN) {
        filterTermModifierList = filterTermModifierIsWithin;
      }
      this.filterTermModifierOptions = filterTermModifierList.map(termModifier => {
        return FilterItemUtils.generatorTermModifierOption(termModifier);
      });
    }
  };

  onDeleteFilter = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    const { index } = this.props;
    this.props.deleteFilter(index);
  };

  resetState = (filter) => {
    this.setState({ filterTerm: filter.filter_term });
  };

  onSelectConjunction = (value) => {
    const { filterConjunction } = this.props;
    if (filterConjunction === value.filterConjunction) {
      return;
    }
    this.props.updateConjunction(value.filterConjunction);
  };

  onSelectColumn = (value) => {
    const { index, filter } = this.props;
    const { column } = value;
    if (column.key === filter.column_key) return;

    let newFilter = getFilterByColumn(column, filter);
    if (!newFilter) return;

    this.resetState(newFilter);
    this.props.updateFilter(index, newFilter);
  };

  onSelectPredicate = (value) => {
    const { index, filter, filterColumn } = this.props;
    const { filterPredicate } = value;
    if (filter.filter_predicate === filterPredicate) {
      return;
    }
    let newFilter = getUpdatedFilterByPredicate(filter, filterColumn, filterPredicate);
    this.resetState(newFilter);
    this.props.updateFilter(index, newFilter);
  };

  onSelectTermModifier = (value) => {
    const { index, filter } = this.props;
    const { filterTermModifier } = value;
    const inputRangeLabel = [
      FILTER_TERM_MODIFIER_TYPE.EXACT_DATE,
      FILTER_TERM_MODIFIER_TYPE.NUMBER_OF_DAYS_AGO,
      FILTER_TERM_MODIFIER_TYPE.NUMBER_OF_DAYS_FROM_NOW,
      FILTER_TERM_MODIFIER_TYPE.THE_NEXT_NUMBERS_OF_DAYS,
      FILTER_TERM_MODIFIER_TYPE.THE_PAST_NUMBERS_OF_DAYS
    ];
    if (filter.filter_term_modifier === filterTermModifier) {
      return;
    }
    let filter_term = filter.filter_term;
    if (inputRangeLabel.indexOf(filter.filter_term_modifier) > -1) {
      filter_term = '';
    }
    let newFilter = Object.assign({}, filter, { filter_term_modifier: filterTermModifier, filter_term });
    this.resetState(newFilter);
    this.props.updateFilter(index, newFilter);
  };

  onSelectSingle = (value) => {
    const { index, filter } = this.props;
    const { columnOption: option } = value;
    if (filter.filter_term === option.id) {
      return;
    }

    let newFilter = getUpdatedFilterBySelectSingle(filter, option);
    this.resetState(newFilter);
    this.props.updateFilter(index, newFilter);
  };

  onSelectMultiple = (value) => {
    const { index, filter } = this.props;
    const { columnOption: option } = value;
    let newFilter = getUpdatedFilterBySelectMultiple(filter, option);
    this.resetState(newFilter);
    this.props.updateFilter(index, newFilter);
  };

  onSelectCollaborator = (value) => {
    const { index, filter } = this.props;
    const { columnOption: collaborator } = value;
    let newFilter = getUpdatedFilterByCollaborator(filter, collaborator);
    this.resetState(newFilter);
    this.props.updateFilter(index, newFilter);
  };

  onSelectCreator = (value) => {
    const { index, filter } = this.props;
    const { columnOption: collaborator } = value;
    let newFilter = getUpdatedFilterByCreator(filter, collaborator);
    // the predicate is 'is' or 'is not'
    if (!newFilter) {
      return;
    }
    this.resetState(newFilter);
    this.props.updateFilter(index, newFilter);

  };

  onFilterTermCheckboxChanged = () => {
    const { filterColumn } = this.props;
    const value = this.checkboxEditor.getValue();
    const checked = value[filterColumn.key];
    this.onFilterTermChanged(checked);
  };

  onFilterTermTextChanged = (value) => {
    this.onFilterTermChanged(value);
  };

  onFilterTermNumberChanged = () => {
    const value = this.numberEditor.getValue();
    this.onFilterTermChanged(Object.values(value)[0]);
  };

  onFilterTermDurationChanged = () => {
    const value = this.durationEditor.getValue();
    this.onFilterTermChanged(value);
  };

  onFilterTermChanged = (newFilterTerm) => {
    const { index, filter } = this.props;
    const { filterTerm } = this.state;
    if (newFilterTerm !== filterTerm) {
      this.setState({ filterTerm: newFilterTerm });
      let newFilter = Object.assign({}, filter, { filter_term: newFilterTerm });
      this.props.updateFilter(index, newFilter);
    }
  };

  onMouseEnterRateItem = (index) => {
    this.setState({ enterRateItemIndex: index });
  };

  onMouseLeaveRateItem = () => {
    this.setState({ enterRateItemIndex: 0 });
  };

  onChangeRateNumber = (index) => {
    this.onFilterTermChanged(index);
  };

  getInputComponent = (type) => {
    const { filterColumn, readOnly, isInModal } = this.props;
    const { filterTerm } = this.state;
    if (type === INPUT_CMP_TYPE_MAP.TEXT) {
      return (
        <DtableSearchInput
          value={filterTerm}
          onChange={this.onFilterTermTextChanged}
          autoFocus={false}
          className={classnames('text-truncate')}
          disabled={readOnly}
        />
      );
    } else if (type === INPUT_CMP_TYPE_MAP.CHECKBOX) {
      return (
        <div className="checkbox-filter-term">
          <CheckboxEditor
            ref={ref => this.checkboxEditor = ref}
            column={filterColumn}
            value={filterTerm}
            className='dtable-ui-filter-item-checkbox'
            onChange={this.onFilterTermCheckboxChanged}
            readOnly={readOnly}
          />
        </div>
      );
    } else if (type === INPUT_CMP_TYPE_MAP.NUMBER) {
      return (
        <NumberEditor
          ref={ref => this.numberEditor = ref}
          column={filterColumn}
          value={filterTerm}
          onCommit={this.onFilterTermNumberChanged}
          readOnly={readOnly}
        />
      );
    } else if (type === INPUT_CMP_TYPE_MAP.DURATION) {
      return (
        <DurationEditor
          ref={ref => this.durationEditor = ref}
          className="filter-popover-duration-editor"
          isInModal={isInModal}
          column={filterColumn}
          value={filterTerm}
          onCommit={this.onFilterTermDurationChanged}
          disabled={readOnly}
          autoFocus={false}
        />
      );
    }
  };

  renderConjunction = () => {
    const { index, filterConjunction, conjunctionOptions, readOnly, isInModal } = this.props;
    switch (index) {
      case 0: {
        return null;
      }
      case 1: {
        const activeConjunction = FilterItemUtils.getActiveConjunctionOption(filterConjunction);
        return (
          <DTableCustomizeSelect
            value={activeConjunction}
            options={conjunctionOptions}
            onSelectOption={this.onSelectConjunction}
            isInModal={isInModal}
            isLocked={readOnly}
          />
        );
      }
      default: {
        return (
          <span className="selected-conjunction-show">{getLocale(filterConjunction)}</span>
        );
      }
    }

  };

  renderMultipleSelectOption = (options = [], filterTerm) => {
    const { filter, readOnly } = this.props;
    const { filter_predicate } = filter;
    let isSupportMultipleSelect = false;
    // The first two options are used for single selection, and the last four options are used for multiple selection
    const supportMultipleSelectOptions = [
      FILTER_PREDICATE_TYPE.IS_ANY_OF,
      FILTER_PREDICATE_TYPE.IS_NONE_OF,
      FILTER_PREDICATE_TYPE.HAS_ANY_OF,
      FILTER_PREDICATE_TYPE.HAS_ALL_OF,
      FILTER_PREDICATE_TYPE.HAS_NONE_OF,
      FILTER_PREDICATE_TYPE.IS_EXACTLY
    ];
    if (supportMultipleSelectOptions.includes(filter_predicate)) {
      isSupportMultipleSelect = true;
    }
    const className = 'select-option-name multiple-select-option';
    let labelArray = [];
    if (Array.isArray(options) && Array.isArray(filterTerm)) {
      filterTerm.forEach((item) => {
        let inOption = options.find(option => option.id === item);
        let optionStyle = { margin: '0 10px 0 0' };
        let optionName = null;
        if (inOption) {
          optionName = inOption.name;
          optionStyle.background = inOption.color;
          optionStyle.color = inOption.textColor || null;
        } else {
          optionStyle.background = DELETED_OPTION_BACKGROUND_COLOR;
          optionName = getLocale(DELETED_OPTION_TIPS);
        }
        labelArray.push(
          <span className={className} style={optionStyle} key={'option_' + item} title={optionName} aria-label={optionName}>
            {optionName}
          </span>
        );
      });
    }
    const selectedOptionNames = labelArray.length > 0 ? { label: (<Fragment>{labelArray}</Fragment>) } : {};

    const dataOptions = options.map(option => {
      return FilterItemUtils.generatorMultipleSelectOption(option, filterTerm);
    });
    return (
      <DTableCustomizeSelect
        className="selector-multiple-select"
        value={selectedOptionNames}
        options={dataOptions}
        onSelectOption={this.onSelectMultiple}
        placeholder={getLocale('Select_option(s)')}
        searchable={true}
        searchPlaceholder={getLocale('Search_option')}
        noOptionsPlaceholder={getLocale('No_options_available')}
        supportMultipleSelect={isSupportMultipleSelect}
        isInModal={this.props.isInModal}
        isLocked={readOnly}
      />
    );
  };

  renderFilterTerm = (filterColumn) => {
    const { index, filter, collaborators, userDepartmentIdsMap, departments, lang, firstDayOfWeek, readOnly } = this.props;
    const { type } = filterColumn;
    const { filter_term, filter_predicate, filter_term_modifier } = filter;
    // predicate is empty or not empty
    if (EMPTY_PREDICATE.includes(filter_predicate)) {
      return null;
    }

    // the cell value will be date
    // 1. DATE
    // 2. CTIME: create-time
    // 3. MTIME: modify-time
    // 4. FORMULA: result_type is date
    if (isDateColumn(filterColumn)) {
      const inputRangeLabel = [
        FILTER_TERM_MODIFIER_TYPE.EXACT_DATE,
        FILTER_TERM_MODIFIER_TYPE.NUMBER_OF_DAYS_AGO,
        FILTER_TERM_MODIFIER_TYPE.NUMBER_OF_DAYS_FROM_NOW,
        FILTER_TERM_MODIFIER_TYPE.THE_NEXT_NUMBERS_OF_DAYS,
        FILTER_TERM_MODIFIER_TYPE.THE_PAST_NUMBERS_OF_DAYS
      ];
      if (inputRangeLabel.indexOf(filter_term_modifier) > -1) {
        if (filter_term_modifier === 'exact_date') {
          return (
            <FilterCalendar
              lang={lang}
              value={this.state.filterTerm}
              filterColumn={filterColumn}
              onChange={this.onFilterTermTextChanged}
              firstDayOfWeek={firstDayOfWeek}
              isReadOnly={readOnly}
            />
          );
        }
        return this.getInputComponent(INPUT_CMP_TYPE_MAP.TEXT);
      }
      return null;
    }

    switch (type) {
      case CellType.TEXT:
      case CellType.LONG_TEXT:
      case CellType.GEOLOCATION:
      case CellType.AUTO_NUMBER:
      case CellType.EMAIL:
      case CellType.URL: { // The data in the formula column is a date type that has been excluded
        if (filter_predicate === FILTER_PREDICATE_TYPE.IS_CURRENT_USER_ID) {
          return null;
        }
        return this.getInputComponent(INPUT_CMP_TYPE_MAP.TEXT);
      }
      case CellType.DURATION: {
        return this.getInputComponent(INPUT_CMP_TYPE_MAP.DURATION);
      }
      case CellType.NUMBER:{
        return this.getInputComponent(INPUT_CMP_TYPE_MAP.NUMBER);
      }
      case CellType.CHECKBOX: {
        return this.getInputComponent(INPUT_CMP_TYPE_MAP.CHECKBOX);
      }
      case CellType.SINGLE_SELECT: {
        // get options
        let { options = [] } = filterColumn.data || {};
        if ([FILTER_PREDICATE_TYPE.IS_ANY_OF, FILTER_PREDICATE_TYPE.IS_NONE_OF].includes(filter_predicate)) {
          return this.renderMultipleSelectOption(options, filter_term);
        }
        let selectedOption = options.find(option => option.id === filter_term);
        let selectedOptionName = {};
        if (selectedOption) {
          const className = 'select-option-name single-select-option';
          const style = { background: selectedOption.color, color: selectedOption.textColor || null };
          selectedOptionName = { label: <span className={className} style={style} title={selectedOption.name} aria-label={selectedOption.name}>{selectedOption.name}</span> };
        }

        let dataOptions = options.map(option => {
          return FilterItemUtils.generatorSingleSelectOption(option);
        });
        return (
          <DTableCustomizeSelect
            className="selector-single-select"
            value={selectedOptionName}
            options={dataOptions}
            onSelectOption={this.onSelectSingle}
            placeholder={getLocale('Select_an_option')}
            searchable={true}
            searchPlaceholder={getLocale('Search_option')}
            noOptionsPlaceholder={getLocale('No_options_available')}
            isInModal={this.props.isInModal}
            isLocked={readOnly}
          />
        );
      }
      case CellType.MULTIPLE_SELECT: {
        let { options = [] } = filterColumn.data || {};
        return this.renderMultipleSelectOption(options, filter_term);
      }
      case CellType.DEPARTMENT_SINGLE_SELECT: {
        if ([FILTER_PREDICATE_TYPE.IS_ANY_OF, FILTER_PREDICATE_TYPE.IS_NONE_OF].includes(filter_predicate)) {
          return (
            <DepartmentMultipleSelectFilter
              value={filter_term || []}
              userDepartmentIdsMap={userDepartmentIdsMap}
              departments={departments}
              onCommit={this.onSelectMultiple}
              isInModal={this.props.isInModal}
              readOnly={readOnly}
            />
          );
        }
        return (
          <DepartmentSingleSelectFilter
            column={filterColumn}
            value={filter_term || ''}
            userDepartmentIdsMap={userDepartmentIdsMap}
            departments={departments}
            onCommit={this.onSelectSingle}
            isInModal={this.props.isInModal}
            readOnly={readOnly}
          />
        );
      }
      case CellType.COLLABORATOR: {
        if (filter_predicate === FILTER_PREDICATE_TYPE.INCLUDE_ME) {
          return null;
        }
        return (
          <CollaboratorFilter
            filterIndex={index}
            filterTerm={filter_term || []}
            filter_predicate={filter_predicate}
            collaborators={collaborators}
            onSelectCollaborator={this.onSelectCollaborator}
            isInModal={this.props.isInModal}
            readOnly={readOnly}
          />
        );
      }
      case CellType.CREATOR:
      case CellType.LAST_MODIFIER: {
        if (filter_predicate === FILTER_PREDICATE_TYPE.INCLUDE_ME) {
          return null;
        }
        const creators = collaborators.concat([generateDefaultUser('anonymous')]);
        return (
          <CollaboratorFilter
            filterIndex={index}
            filterTerm={filter_term || []}
            collaborators={creators}
            onSelectCollaborator={this.onSelectCreator}
            isInModal={this.props.isInModal}
            readOnly={readOnly}
          />
        );
      }
      case CellType.RATE: {
        let { rate_max_number } = filterColumn.data || {};
        let rateList = [];
        for (let i = 0; i < rate_max_number; i++) {
          let rateItem = (
            <RateItem
              key={i}
              enterRateItemIndex={this.state.enterRateItemIndex}
              rateItemIndex={i + 1}
              onMouseEnterRateItem={this.onMouseEnterRateItem}
              onMouseLeaveRateItem={this.onMouseLeaveRateItem}
              value={Number(filter_term) || rate_max_number}
              column={filterColumn}
              isShowRateItem={true}
              onChangeRateNumber={this.onChangeRateNumber}
              editable={!readOnly}
            />
          );
          rateList.push(rateItem);
        }
        return (
          <div className="filter-rate-list">
            {rateList}
          </div>
        );
      }
      case CellType.FORMULA:
      case CellType.LINK_FORMULA: {
        return this.renderFormulaFilterTerm(filter_predicate, filter_term, index, filterColumn);
      }
      case CellType.LINK: {
        return this.renderLinkFilterTerm(filter_predicate, filter_term, index, filterColumn);
      }
      default: {
        return null;
      }
    }
  };

  renderFormulaFilterTerm = (filterPredicate, filterTerm, index, filterColumn) => {
    const { data } = filterColumn || {};
    const { result_type } = data || {};
    if (filterPredicate === FILTER_PREDICATE_TYPE.IS_CURRENT_USER_ID) {
      return null;
    }
    if (result_type === FORMULA_RESULT_TYPE.NUMBER) {
      const { format } = filterColumn.data || {};
      if (format === CellType.DURATION) {
        return this.getInputComponent(INPUT_CMP_TYPE_MAP.DURATION, filterColumn);
      }
      return this.getInputComponent(INPUT_CMP_TYPE_MAP.NUMBER, filterColumn);
    }
    if (result_type === FORMULA_RESULT_TYPE.ARRAY) {
      return this.renderFilterTermByArrayType(filterPredicate, filterTerm, index, filterColumn);
    }
    return this.getInputComponent(INPUT_CMP_TYPE_MAP.TEXT);
  };

  renderLinkFilterTerm = (filterPredicate, filterTerm, index, filterColumn) => {
    if (filterPredicate === FILTER_PREDICATE_TYPE.IS_CURRENT_USER_ID) {
      return null;
    }
    return this.renderFilterTermByArrayType(filterPredicate, filterTerm, index, filterColumn);
  };

  renderFilterTermByArrayType = (filterPredicate, filterTerm, index, filterColumn) => {
    const { collaborators, departments, readOnly } = this.props;
    const { data } = filterColumn || {};
    const { array_type, array_data } = data || {};
    if (!array_type) {
      return null;
    }
    const linkedColumn = { type: array_type, data: array_data };
    if (array_type === CellType.SINGLE_SELECT || array_type === CellType.MULTIPLE_SELECT) {
      let { options = [] } = array_data || {};
      return this.renderMultipleSelectOption(options, filterTerm);
    }
    if (array_type === CellType.DEPARTMENT_SINGLE_SELECT) {
      return (
        <DepartmentMultipleSelectFilter
          value={filterTerm || []}
          departments={departments}
          onCommit={this.onSelectMultiple}
          isInModal={this.props.isInModal}
          readOnly={readOnly}
        />
      );
    }
    if (DATE_COLUMN_OPTIONS.includes(array_type) ||
      array_type === CellType.RATE ||
      array_type === CellType.CHECKBOX
    ) {
      return this.renderFilterTerm(linkedColumn);
    }
    if (COLLABORATOR_COLUMN_TYPES.includes(array_type)) {
      if (filterPredicate === FILTER_PREDICATE_TYPE.INCLUDE_ME) {
        return null;
      }
      return (
        <CollaboratorFilter
          filterIndex={index}
          filterTerm={filterTerm || []}
          collaborators={collaborators}
          onSelectCollaborator={this.onSelectCollaborator}
          placeholder={getLocale('Add_collaborator')}
          isInModal={this.props.isInModal}
          readOnly={readOnly}
        />
      );
    }
    return this.getInputComponent(INPUT_CMP_TYPE_MAP.TEXT);
  };

  isRenderErrorTips = () => {
    const { errMsg } = this.props;
    return errMsg && errMsg !== FILTER_ERR_MSG.INCOMPLETE_FILTER;
  };

  renderErrorMessage = () => {
    if (!this.isRenderErrorTips()) {
      return null;
    }
    return (
      <div className="ml-2">
        <span ref={this.invalidFilterTip} className="dtable-font dtable-icon-exclamation-triangle invalid-filter"></span>
        <UncontrolledTooltip
          target={this.invalidFilterTip}
          placement='bottom'
          fade={false}
        >
          {getLocale('Invalid_filter')}
        </UncontrolledTooltip>
      </div>
    );
  };

  render() {
    const { filterPredicateOptions, filterTermModifierOptions } = this;
    const { filter, filterColumn, filterColumnOptions, readOnly } = this.props;
    const { filter_predicate, filter_term_modifier } = filter;
    const activeColumn = FilterItemUtils.generatorColumnOption(filterColumn);
    const activePredicate = FilterItemUtils.generatorPredicateOption(filter_predicate);
    let activeTermModifier = null;
    let _isCheckboxColumn = false;
    if (isDateColumn(filterColumn)) {
      activeTermModifier = FilterItemUtils.generatorTermModifierOption(filter_term_modifier);
    } else if (isCheckboxColumn(filterColumn)) {
      _isCheckboxColumn = true;
    }

    const { type } = filterColumn;
    const computedColumnTypes = [CellType.FORMULA, CellType.LINK_FORMULA, CellType.LINK];
    const isContainPredicate = [FILTER_PREDICATE_TYPE.CONTAINS, FILTER_PREDICATE_TYPE.NOT_CONTAIN].includes(filter_predicate);
    const isRenderErrorTips = this.isRenderErrorTips();
    const showToolTip = (computedColumnTypes.includes(type) && isContainPredicate) && !isRenderErrorTips;

    // current predicate is not empty
    const isNeedShowTermModifier = !EMPTY_PREDICATE.includes(filter_predicate);

    return (
      <div className="filter-item">
        {!readOnly && (
          <div className="delete-filter" onClick={this.onDeleteFilter}>
            <i className="dtable-font dtable-icon-fork-number"></i>
          </div>
        )}
        <div className="condition">
          <div className="filter-conjunction">
            {this.renderConjunction()}
          </div>
          <div className="filter-container">
            <div className="filter-column">
              <DTableCustomizeSelect
                value={activeColumn}
                options={filterColumnOptions}
                onSelectOption={this.onSelectColumn}
                searchable={true}
                searchPlaceholder={getLocale('Search_column')}
                noOptionsPlaceholder={getLocale('No_results')}
                isInModal={this.props.isInModal}
                isLocked={readOnly}
              />
            </div>
            <div className={`filter-predicate ml-2 ${_isCheckboxColumn ? 'filter-checkbox-predicate' : ''}`}>
              <DTableCustomizeSelect
                value={activePredicate}
                options={filterPredicateOptions}
                onSelectOption={this.onSelectPredicate}
                isInModal={this.props.isInModal}
                isLocked={readOnly}
              />
            </div>
            {isDateColumn(filterColumn) && isNeedShowTermModifier && (
              <div className="filter-term-modifier ml-2">
                <DTableCustomizeSelect
                  value={activeTermModifier}
                  options={filterTermModifierOptions}
                  onSelectOption={this.onSelectTermModifier}
                  isInModal={this.props.isInModal}
                  isLocked={readOnly}
                />
              </div>
            )}
            <div className="filter-term ml-2">
              {this.renderFilterTerm(filterColumn)}
            </div>
            {showToolTip &&
              <div className="ml-2">
                <span ref={this.filterToolTip} id="filter_tool_tip" aria-hidden="true" className="dtable-font dtable-icon-exclamation-triangle" style={{ color: '#FFC92C' }}></span>
                <UncontrolledTooltip placement="bottom" target={this.filterToolTip} >
                  {getLocale('filter_tip_message')}
                </UncontrolledTooltip>
              </div>
            }
            {this.renderErrorMessage()}
          </div>
        </div>
      </div>
    );
  }
}

FilterItem.propTypes = propTypes;

export default FilterItem;
