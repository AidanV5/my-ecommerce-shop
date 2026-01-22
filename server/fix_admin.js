const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'src/db/database.js');
// wait, the previous requires were using relative paths or resolving properly. 
// let's just connect to the db file directly to be safe, like create_admin did.
const dbFile = path.resolve(__dirname, 'ecommerce.db');
const db = new Database(dbFile);

try {
    const update = db.prepare("UPDATE users SET role = 'admin' WHERE username = 'admin'");
    const info = update.run();
    console.log(`Updated ${info.changes} rows. Admin role fixed.`);
} catch (err) {
    console.error("Error updating admin:", err);
}
