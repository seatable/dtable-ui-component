import React from 'react';
import PropTypes from 'prop-types';
import DepartmentSingleSelectFilter from "../DTableFiltersPopover/widgets/department-select-filter/department-single-select-filter";
import DepartmentMultipleSelectFilter from "../DTableFiltersPopover/widgets/department-select-filter/department-multiple-select-filter";

const propTypes = {
  isMultiple: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  column: PropTypes.object,
  userDepartmentIdsMap: PropTypes.object,
  departments: PropTypes.array,
  onCommit: PropTypes.func,
};

function DepartmentSelectFilter(props) {
  const { isMultiple, value, column, userDepartmentIdsMap, departments, onCommit } = props;
  const filterProps = { column, value, userDepartmentIdsMap, departments, onCommit };

  return (
    <>
      {isMultiple ? (
        <DepartmentMultipleSelectFilter {...filterProps} />
      ) : (
        <DepartmentSingleSelectFilter {...filterProps} />
      )}
    </>
  );
};

DepartmentSelectFilter.propTypes = propTypes;

export default DepartmentSelectFilter;
