import React from 'react';
import { COLUMNS_ICON_CONFIG } from 'dtable-utils';
import { getLocale } from '../../lang';
import { FILTER_TERM_MODIFIER_SHOW } from '../constants';

class FilterItemUtils {

  static generatorColumnOption(column) {
    if (!column) return null;
    const { type, name } = column;
    return {
      value: { column },
      label: (
        <>
          <span className="filter-header-icon"><i className={COLUMNS_ICON_CONFIG[type]}></i></span>
          <span className='select-option-name'>{name}</span>
        </>
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
    return {
      value: { filterTermModifier },
      label: <span className='select-option-name'>{getLocale(FILTER_TERM_MODIFIER_SHOW[filterTermModifier])}</span>
    };
  }

  static generatorSingleSelectOption(option) {
    return {
      value: { columnOption: option },
      label: (
        <div className='select-option-name'>
          <div
            className="single-select-option"
            style={{ background: option.color, color: option.textColor || null }}
            title={option.name}
            aria-label={option.name}
          >
            {option.name}
          </div>
        </div>
      )
    };
  }

  static generatorMultipleSelectOption(option, filterTerm) {
    return {
      value: { columnOption: option },
      label: (
        <div className='select-option-name multiple-option-name'>
          <div className="multiple-select-option" style={{ background: option.color, color: option.textColor }} title={option.name} aria-label={option.name}>{option.name}</div>
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
