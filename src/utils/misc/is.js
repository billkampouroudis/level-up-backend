const is = {
  falsy: (item) => {
    return (
      item === 'undefined' ||
      item === null ||
      item === 0 ||
      item === '' ||
      item === ' ' ||
      item === [] ||
      item === {} ||
      item === false ||
      isNaN(item)
    );
  },
  truthy: (item) => {
    return !is.falsy(item);
  },
  emptyObject: (item) => {
    return !(
      item &&
      item.constructor === Object &&
      Object.keys(item).length > 0
    );
  }
};

export default is;
