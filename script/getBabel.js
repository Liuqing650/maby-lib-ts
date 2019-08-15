const path = require('path');
const fs = require('fs');
const stripJsonComments = require('strip-json-comments');
const parseJSON = require('parse-json-pretty');

function getBabel() {
  const userBabelrcPath = path.resolve(process.cwd(), '.babelrc');
  if (fs.existsSync(userBabelrcPath)) {
    var babelConfigText = '{}';
    try {
      babelConfigText = stripJsonComments(fs.readFileSync(userBabelrcPath, 'utf-8'))
    } catch (error) {
      console.log('babelrc 中的配置不是一个正确的JSON文件', error);
    }
    var babelConfig = parseJSON(babelConfigText, '.babelrc');
    return babelConfig;
  }
  return {
    presets: ['env', 'react', 'stage-0'],
    plugins: ['transform-class-properties']
  };
}

module.exports = getBabel;
