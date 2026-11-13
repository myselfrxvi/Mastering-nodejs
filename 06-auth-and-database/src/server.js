import express from 'express';
import crypto from 'node:crypto';
import { db } from './db.js'
import { title } from 'node:process';

const app = new express(title = "Security and auth system.")
app.use(express.json());

const PORT = process.env.PORT || 8080;

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')
    return { salt, password }
}

