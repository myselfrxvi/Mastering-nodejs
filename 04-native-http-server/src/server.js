import http from "node:http";
import { type } from "node:os";

const tasks = [
    { id: 1, title: 'Learn Node.js Event Loop', completed: true },
    { id: 2, title: 'Master Buffers and Streams', completed: true },
];

const server = http.createServer((req, res) => {
    const { method, url } = req;
    console.log(`Incoming request: ${method} ${url}`);

    if (method === 'GET' && url === '/api/tasks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));

    }
    else if (method === 'POST' && url === '/api/tasks') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                const newTask = {
                    id: tasks.length + 1,
                    title: parsed.title || 'Untitled task.',
                    completed: false,
                };
                tasks.push(newTask)
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newTask));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
        });
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found.' }))
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`\n🚀 Native HTTP Server listening at: http://localhost:${PORT}`);
    console.log(`👉 Test Route: http://localhost:${PORT}/api/tasks`);
    console.log('Press Ctrl+C to stop.\n');
})