// Simple automated test using Node.js built-in fetch!
import http from 'node:http';
import { fork } from 'node:child_process';
import path from 'node:path';

const serverProcess = fork(path.join('04-native-http-server', 'src', 'server.js'));

// Wait 500ms for server to boot
await new Promise(r => setTimeout(r, 500));

try {
  console.log('--- 1. Testing GET /api/tasks ---');
  const getRes = await fetch('http://localhost:3000/api/tasks');
  const getTasks = await getRes.json();
  console.log('GET Status:', getRes.status);
  console.log('Initial Tasks:', getTasks);

  console.log('\n--- 2. Testing POST /api/tasks ---');
  const postRes = await fetch('http://localhost:3000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Deploy to Cloud' })
  });
  const newTask = await postRes.json();
  console.log('POST Status:', postRes.status);
  console.log('Created Task:', newTask);

  console.log('\n--- 3. Verifying GET after POST ---');
  const verifyRes = await fetch('http://localhost:3000/api/tasks');
  const finalTasks = await verifyRes.json();
  console.log('Updated Task List:', finalTasks);
  console.log('\n🎉 ALL NATIVE HTTP TESTS PASSED!');
} finally {
  serverProcess.kill();
}

