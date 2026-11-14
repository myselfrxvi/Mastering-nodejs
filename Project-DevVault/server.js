import express from "express";
import path from "node:path";
import { Readable } from "node:stream";
import { db } from "./database/db.js"
import { hashPassword, createSession, requireAuth } from "./auth.js";

const app = express();
app.use(express.json());

// Enable CORS so the dashboard works seamlessly everywhere:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(import.meta.dirname, 'public')));

app.post('/api/auth/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are missing.' })
    }
    try {
        const { salt, hash } = hashPassword(password);
        const insert = db.prepare('INSERT INTO users (username, salt, password_hash) VALUES (?, ?, ?)');
        const result = insert.run(username, salt, hash)
        const userID = Number(result.lastInsertRowid);
        const token = createSession(userID);
        res.status(201).json({ message: 'User registered!', token, username })
    } catch (err) {
        res.status(409).json({ error: 'Username already taken.' })
    }
})

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' })
    }
    const { hash } = hashPassword(password, user.salt)
    if (hash !== user.password_hash) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    const token = createSession(user.id)
    res.status(200).json({
        message:
            'Login succesful.',
        token,
        username: user.username
    })
})

app.post('/api/snippets', requireAuth, (req, res) => {
    const { title, language, code, tags } = req.body;
    if (!title || !code) {
        return res.status(400).json({ error: 'Title and code are required' });
    }
    const insert = db.prepare(`
    INSERT INTO snippets (user_id, title, language, code, tags)
    VALUES (?, ?, ?, ?, ?)
  `);
    const result = insert.run(
        req.user.id,
        title,
        language || 'plaintext',
        code,
        tags || ''
    );
    res.status(201).json({
        message: 'Snippet saved to DevVault!',
        snippetId: Number(result.lastInsertRowid),
    });
});

app.get('/api/snippets', requireAuth,
    (req, res) => {
        const { tag, search } = req.query;

        let query = 'SELECT id, title, language, code, tags, created_at FROM snippets WHERE user_id = ?';
        const params = [req.user.id]

        if (tag) {
            query += ' AND tags LIKE ?'
            params.push(`%${tag}%`)
        }
        if (search) {
            query += ' AND (title LIKE ? OR code LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY id DESC';
        const snippets = db.prepare(query).all(...params);
        res.status(200).json({ count: snippets.length, snippets });
    });

app.delete("/api/snippets/:id", requireAuth, (req, res) => {
    const snippetId = Number(req.params.id);
    const result = db.prepare(
        'DELETE FROM snippets WHERE id = ? AND user_id = ?'
    ).run(snippetId, req.user.id)
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Snippet not found' })
    }
    res.status(200).json({ message: `Snippet #${snippetId} deleted succesfully.` })
})

app.get('/api/snippets/export/markdown', requireAuth, (req, res) => {
    const snippets = db.prepare(
        'SELECT title, language, code, created_at FROM snippets WHERE user_id = ?'
    ).all(req.user.id)

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', 'attachment;filename="devvault-export.md"')
    const stream = new Readable({
        read() {
            this.push(`# 🗄️ DevVault Export for ${req.user.username}\n\n`);
            for (const s of snippets) {
                this.push(`## ${s.title}\n*Created: ${s.created_at}*\n\n`);
                this.push('```' + s.language + '\n');
                this.push(s.code + '\n');
                this.push('```\n\n---\n\n');
            }
            this.push(null);
        },
    });
    stream.pipe(res);
})

app.listen(PORT, () => {
    console.log(`~DevVault is running at ${PORT}`)
})
