const fs = require('fs');
const path = require('path');

module.exports = function() {
  const tsConfigPath = path.resolve(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsConfigPath)) {
    const tsConfig = require(tsConfigPath);
    return tsConfig.compilerOptions;
  }
};