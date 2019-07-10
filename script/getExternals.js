const path = require('path');

// 获取loaders
const getExternals = (options) => {
  const userExternals = options.externals;
  let externals = {
    'react': 'React',
    'react-dom': 'ReactDom'
  };
  if (userExternals) {
    if (typeof userExternals === 'function') {
      return userExternals(externals);
    } else if (typeof userResolve === 'object') {
      externals = Object.assign({}, userResolve, externals);
    }
  }
  return externals;
};
module.exports = getExternals;
