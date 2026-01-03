import('./seed.js')
  .then(() => console.log('seed import finished'))
  .catch(err => { console.error('IMPORT ERROR:', err); process.exit(1); });
