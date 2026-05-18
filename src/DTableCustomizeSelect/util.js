export const onKeyDown = (e) => {
  if (e.key === 'Enter' || e.key === 'Space') {
    e.target.click();
  }
};
