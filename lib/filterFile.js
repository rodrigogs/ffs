const path = require('path');
const listDirFiles = require('./listDirFiles');
const getFileInfo = require('./getFileInfo');

const _filterFile = async (conditionalFunction, dir = process.cwd(), options = {}) => {
  const opts = Object.assign({
    excludes: [],
    depth: -1,
    backward: false,
  }, options);

  const foundFiles = [];

  const dirFiles = await listDirFiles(dir)
    .then(files => files
      .filter(file => opts.excludes.indexOf(file) === -1)
      .map(file => path.resolve(dir, file)))
    .then(files => Promise.all(files.map(getFileInfo)));

  const files = dirFiles.filter(f => f.isFile());

  let matchingFiles = files.filter(conditionalFunction);
  foundFiles.push(...matchingFiles);

  if (opts.depth !== 0) {
    const nextOpts = Object.assign(opts, {
      depth: (opts.depth !== -1) ? opts.depth - 1 : -1,
    });

    const dirs = dirFiles.filter(f => f.isDirectory());

    if (opts.backward) {
      const backwardDir = path.dirname(dir);
      matchingFiles = _filterFile(conditionalFunction, backwardDir, nextOpts);
      foundFiles.push(...matchingFiles);
    } else {
      matchingFiles = [].concat(...(await Promise
        .all(dirs.map(d => _filterFile(conditionalFunction, d.absolute, nextOpts)))));
      foundFiles.push(...matchingFiles);
    }
  }

  return foundFiles;
};

/**
 * @param {String|Function<Boolean>} fileNameOrConditionFunction
 * @param {String} [dir = process.cwd()]
 * @param {Object} [options = {}]
 * @param {String[]} [options.excludes = []]
 * @param {Number} [options.depth = -1]
 * -1   = Fully recursive
 * 0    = Non recursive
 * 1... = To depth
 * @param {Boolean} [options.backward = false]
 * @returns {Promise<Object>}
 */
const filterFile = async (fileNameOrConditionFunction, dir = process.cwd(), options) => {
  if (typeof fileNameOrConditionFunction === 'string') {
    return _filterFile(file => file && file.name === fileNameOrConditionFunction, dir, options);
  }
  if (typeof fileNameOrConditionFunction === 'function') {
    return _filterFile(fileNameOrConditionFunction, dir, options);
  }
  return [];
};

module.exports = filterFile;