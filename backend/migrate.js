const db = require('./db');
console.log('SQLite DB ready at', require('path').resolve(__dirname, 'data.sqlite'));
console.log('Existing projects sample:');
const rows = db.raw.prepare('SELECT id, status, created_at FROM projects ORDER BY created_at DESC LIMIT 5').all();
console.log(rows);
