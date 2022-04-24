export const searchCollaborators = (collaborators, searchValue) => {
  const validSearchValue = searchValue ? searchValue.trim().toLowerCase() : '';
  const validCollaborators = Array.isArray(collaborators) && collaborators.length > 0 ? collaborators : [];
  if (!validSearchValue) return validCollaborators;
  return validCollaborators.filter(collaborator => {
    const { name, name_pinyin = '' } = collaborator;
    if (name.toString().toLowerCase().indexOf(validSearchValue) > -1) return true;
    if (!name_pinyin) return false;
    const validNamePinyin = name_pinyin.toString().toLowerCase();
    const validSearchPinyinValue = validSearchValue.replace(/ |'/g, '');

    // complete
    if (validNamePinyin.indexOf(validSearchPinyinValue) > -1) return true;
    if (validNamePinyin.replace(/'/g, '').indexOf(validSearchPinyinValue) > -1) return true;

    const validNamePinyinList = validNamePinyin.split('\'');
    // acronym
    const namePinyinAcronym = validNamePinyinList.map(item => item && item.trim() ? item.trim().slice(0, 1) : '');
    if (namePinyinAcronym.join('').indexOf(validSearchPinyinValue) > -1) return true;

    return false;
  });
};
