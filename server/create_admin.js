const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../ecommerce.db');
const db = new Database(dbPath);

async function createAdmin() {
    const username = 'admin';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const insert = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
        insert.run(username, hashedPassword, 'admin');
        console.log(`Admin user created successfully.\nUsername: ${username}\nPassword: ${password}`);
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            console.log('Admin user already exists.');
            // Update existing admin password to be sure
            const update = db.prepare("UPDATE users SET password = ?, role = 'admin' WHERE username = ?");
            update.run(hashedPassword, username);
            console.log(`Updated existing 'admin' user with password: ${password}`);
        } else {
            console.error('Error creating admin:', err);
        }
    }
}

createAdmin();
