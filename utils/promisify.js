const p = (cb, ...args) => {
  return new Promise((resolve, reject) => {
    const promised = (...props) => {
      if (props.length === 1) {
        resolve(props[0]);
        return;
      }

      if (props.length > 1 && props[0]) {
        reject(props[0]);
        return;
      }
      resolve(props[1]);
    };

    cb.apply({}, [...args, promised]);
  });
};

module.exports = {
  p,
};
