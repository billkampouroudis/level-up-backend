const get = {
  safe: (fn, defaultValue = null) => {
    try {
      return fn();
    } catch (e) {
      return defaultValue;
    }
  }
};

export default get;
