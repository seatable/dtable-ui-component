import React, { Fragment } from 'react';
import { COLUMNS_ICON_CONFIG } from 'dtable-utils';
import { getLocale } from '../../lang';

class FilterItemUtils {

  static generatorColumnOption(column) {
    if (!column) return null;
    const { type, name } = column;
    return {
      value: { column },
      label: (
        <Fragment>
          <span className="filter-header-icon"><i className={COLUMNS_ICON_CONFIG[type]}></i></span>
          <span className='select-option-name'>{name}</span>
        </Fragment>
      )
    };
  }

  static generatorPredicateOption(filterPredicate) {
    return {
      value: { filterPredicate },
      label: <span className='select-option-name'>{getLocale(filterPredicate)}</span>
    };
  }

  static generatorTermModifierOption(filterTermModifier) {
    const FILTER_TERM_MODIFIER_SHOW = {
      'today': getLocale('today'),
      'tomorrow': getLocale('tomorrow'),
      'yesterday': getLocale('yesterday'),
      'one_week_ago': getLocale('one_week_ago'),
      'one_week_from_now': getLocale('one_week_from_now'),
      'one_month_ago': getLocale('one_month_ago'),
      'one_month_from_now': getLocale('one_month_from_now'),
      'number_of_days_ago': getLocale('number_of_days_ago'),
      'number_of_days_from_now': getLocale('number_of_days_from_now'),
      'exact_date': getLocale('exact_date'),
      'the_past_week': getLocale('last_week'),
      'the_past_month': getLocale('last_month'),
      'the_past_year': getLocale('last_year'),
      'the_next_week': getLocale('the_next_week'),
      'the_next_month': getLocale('the_next_month'),
      'the_next_year': getLocale('the_next_year'),
      'the_next_numbers_of_days': getLocale('the_next_numbers_of_days'),
      'the_past_numbers_of_days': getLocale('the_past_numbers_of_days'),
      'this_week': getLocale('this_week'),
      'this_month': getLocale('this_month'),
      'this_year': getLocale('this_year')
    };
    return {
      value: { filterTermModifier },
      label: <span className='select-option-name'>{FILTER_TERM_MODIFIER_SHOW[filterTermModifier]}</span>
    };
  }

  static generatorSingleSelectOption(option) {
    return {
      value: { columnOption: option },
      label: (
        <div className='select-option-name'>
          <div className="single-select-option" style={{ background: option.color, color: option.textColor || '#212529' }} title={option.name} aria-label={option.name}>{option.name}</div>
        </div>
      )
    };
  }

  static generatorMultipleSelectOption(option, filterTerm) {
    return {
      value: { columnOption: option },
      label: (
        <div className='select-option-name multiple-option-name'>
          <div className="multiple-select-option" style={{ background: option.color, color: option.textColor || '#212529' }} title={option.name} aria-label={option.name}>{option.name}</div>
          <div className='multiple-check-icon'>
            {filterTerm.indexOf(option.id) > -1 && <i className="option-edit dtable-font dtable-icon-check-mark"></i>}
          </div>
        </div>
      )
    };
  }

  static generatorConjunctionOptions() {
    return [
      {
        value: { filterConjunction: 'And' },
        label: (<span className='select-option-name'>{getLocale('And')}</span>)
      },
      {
        value: { filterConjunction: 'Or' },
        label: (<span className='select-option-name'>{getLocale('Or')}</span>)
      }
    ];
  }

  static getActiveConjunctionOption(conjunction) {
    if (conjunction === 'And') {
      return {
        value: { filterConjunction: 'And' },
        label: (<span className='select-option-name'>{getLocale('And')}</span>)
      };
    }
    return {
      value: { filterConjunction: 'Or' },
      label: (<span className='select-option-name'>{getLocale('Or')}</span>)
    };
  }
}

export default FilterItemUtils;
