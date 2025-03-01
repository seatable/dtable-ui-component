import React from 'react';
import PropTypes from 'prop-types';
import { getLocale } from '../lang';

const SelectorHeaderItemPropTypes = {
  type: PropTypes.string,
  clickHandler: PropTypes.func,
  selectedType: PropTypes.string,
  selectedItem: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

class SelectorHeaderItem extends React.Component {

  render() {
    const { type, clickHandler, selectedType, selectedItem } = this.props;
    return (
      <div
        className={
          'dtable-ui-geolocation-selector-header-item ' +
          (selectedType === type
            ? 'selected-dtable-ui-geolocation-selector-header-item'
            : '')
        }
        onClick={() => {
          clickHandler(type);
        }}
      >
        <span>
          {selectedItem ? selectedItem.name ? selectedItem.name : selectedItem : getLocale('Select_location')}
        </span>
        <i className='dtable-font dtable-icon-down3'></i>
      </div>
    );
  }
}

SelectorHeaderItem.propTypes = SelectorHeaderItemPropTypes;

export default SelectorHeaderItem;
