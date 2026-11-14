import crypto from "node:crypto";
import { db } from "./database/db.js"

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')
    return { salt, hash }
}

export function createSession(userID) {
    const token = crypto.randomBytes(32).toString('hex')
    db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, userID)
    return token;
}

export function requireAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ error: 'Unauthorized: Missing bearer token' })

    const token = authHeader.split(' ')[1];
    const query = `
    SELECT users.id, users.username 
    FROM sessions 
    JOIN users ON sessions.user_id = users.id 
    WHERE sessions.token = ?
  `;

    const user = db.prepare(query).get(token)
    if (!user) {
        return res.status(401).json({ error: 'Invalid or expired session ID.' })
    }
    req.user = user
    next();
}

