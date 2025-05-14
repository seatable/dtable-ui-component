export const searchDepartments = (departments, searchValue) => {
  const validSearchValue = searchValue ? searchValue.trim().toLowerCase() : '';
  const validDepartments = Array.isArray(departments) ? departments : [];
  if (!validSearchValue) return validDepartments;
  return validDepartments.filter(department => {
    const { name } = department;
    if (!name) return false;
    return name.toString().toLowerCase().indexOf(validSearchValue) > -1;
  });
};

export const getNormalizedDepartments = (departments, canExpand = true) => {
  let parentIdMap = {};
  for (let i = 0; i < departments.length; i++) {
    let item = departments[i];
    parentIdMap[item.parent_id] = true;
  }
  return departments.map(depart => {
    const hasChild = canExpand && !!parentIdMap[depart.id];
    const isExpanded = depart.parent_id === -1 ? true : false;
    return { ...depart, hasChild, isExpanded };
  });
};
