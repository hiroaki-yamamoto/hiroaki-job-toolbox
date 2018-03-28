#!/usr/bin/node
((req) => {
  if (process.argv.length > 3) {
    throw new Error('Usage: repver.js [new version]');
  }
  const path = req('path');
  const target = req(path.resolve(process.cwd(), './package.json'));
  [,, target.version] = process.argv;
  console.log(JSON.stringify(target, undefined, 2));
})(require);
