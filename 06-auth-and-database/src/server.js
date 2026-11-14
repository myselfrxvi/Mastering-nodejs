import express from 'express';
import crypto from 'node:crypto';
import { db } from './db.js'
import { title } from 'node:process';
import { error } from 'node:console';

const app = new express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')
    return { salt, hash }
}

function requireAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied: Missing bearer token' })
    }
    const token = authHeader.split(' ')[1];
    const stmt = db.prepare('SELECT id, username FROM users WHERE token = ?');
    const user = stmt.get(token);
    if (!user) {
        return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
    req.user = user;
    next();
}

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username & password required' })
    }

    try {
        const { salt, hash } = hashPassword(password)
        const insert = db.prepare(
            'INSERT INTO users (username, salt, password_hash) VALUES(?,?,?)'
        );
        const result = insert.run(username, salt, hash)

        res.status(201).json({
            message: 'User registered succesfully',
            userID: Number(result.lastInsertRowid),
        });
    } catch (err) {
        res.status(409).json({ error: 'Username already taken.' })
    }
});


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const { hash } = hashPassword(password, user.salt)
    if (hash !== user.password_hash) {
        return res.status(401).json({ error: 'Invalid credentials.' })
    }
    const token = crypto.randomBytes(32).toString('hex');
    db.prepare('UPDATE users SET token = ? WHERE id = ?').run(token, user.id)
    res.status(200).json({ message: 'Login succesfull', token })
})

app.post('/api/notes', requireAuth, (req, res) => {
    const { content } = req.body;

    if (!content) {
        res.status(400).json({ error: 'Content cannot be empty' })
    }
    const result = db.prepare(
        'INSERT INTO notes (user_id, content) VALUES(?, ?)'
    ).run(req.user.id, content)
    return res.status(201).json({ message: 'Note saved!', noteId: Number(result.lastInsertRowid) });
});

app.get('/api/notes', requireAuth, (req, res) => {
    const notes = db.prepare(
        'SELECT id, content, created_at FROM notes WHERE user_id = ? '
    ).all(req.user.id);

    res.status(200).json({ user: req.user.username, notes })
})

app.listen(PORT, () => {
    console.log(`\n🔒 Security Vault API running at: http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log('  POST /api/register');
    console.log('  POST /api/login');
    console.log('  GET  /api/notes (Protected)');
    console.log('  POST /api/notes (Protected)\n');
});