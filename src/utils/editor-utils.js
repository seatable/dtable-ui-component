export const getSelectOptionItem = (options, optionId) => {
  return options.find(option => option.id === optionId);
}