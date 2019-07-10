// 获取入口
const getEntry = ({isDev, libraryName, vendors, options}) => {
  if (isDev) {
    const output = {
      index: [`${process.cwd()}/example/index.tsx`],
      [libraryName]: `${process.cwd()}/src/index.tsx`,
    };
    if (vendors) {
      output.vendors = vendors;
    }
    return output;
  }
  if (options && options.preview) {
    const output = {
      index: [`${process.cwd()}/example/index.tsx`],
    };
    if (vendors) {
      output.vendors = vendors;
    }
    return output;
  }
  return {
    [libraryName]: `${process.cwd()}/src/index.tsx`,
  };
};
module.exports = getEntry;
