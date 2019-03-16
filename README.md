# @rodrigogs/fs
My personal fs wrapper with some advanced features.

## Install
```bash
$ npm install @rodrigogs/fs --save
```

## Usage
```javascript
const fs = require('.');

const fileContent = await fs.readFile('/path/to/file');

const fileExists = await fs.fileExists('/path/to/file');

const fileInfo = await fs.getFileInfo('/relative/to/filename');

const fileFound = await fs.findFile('fileName.foo');

const filteredFile = await fs.filterFile('filename.foo');

const dirFiles = await fs.listDirFiles('/relative/path/to/dir');

await fs.createFile('/relative/to/filename', 'File content');

await fs.deleteFile('/relative/to/filename');
```
