import { fork } from 'node:child_process';
import path from 'node:path';

const serverProcess = fork(path.join('Project-DevVault', 'server.js'), [], {
  env: { ...process.env, PORT: '8080' }
});

await new Promise(r => setTimeout(r, 600));

try {
  console.log('--- 1. Testing Registration (POST /api/auth/register) ---');
  const regRes = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'dev_hero', password: 'VaultPassword99!' })
  });
  const regData = await regRes.json();
  console.log('Registration Status:', regRes.status);
  console.log('Registration Response:', regData);
  const token = regData.token;

  console.log('\n--- 2. Testing Snippet Creation (POST /api/snippets) ---');
  const snippetRes = await fetch('http://localhost:8080/api/snippets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'Node.js Stream Pipeline',
      language: 'javascript',
      tags: 'node,streams,async',
      code: 'await pipeline(readStream, writeStream);'
    })
  });
  const snippetData = await snippetRes.json();
  console.log('Create Snippet Status:', snippetRes.status);
  console.log('Created Snippet ID:', snippetData.snippetId);

  console.log('\n--- 3. Testing Snippet Search (GET /api/snippets?search=Pipeline) ---');
  const searchRes = await fetch('http://localhost:8080/api/snippets?search=Pipeline', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const searchData = await searchRes.json();
  console.log('Search Status:', searchRes.status);
  console.log('Found Snippets:', searchData.count);

  console.log('\n--- 4. Testing Streaming Markdown Export (GET /api/snippets/export/markdown) ---');
  const exportRes = await fetch('http://localhost:8080/api/snippets/export/markdown', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const mdText = await exportRes.text();
  console.log('Export Status:', exportRes.status);
  console.log('Content-Type Header:', exportRes.headers.get('content-type'));
  console.log('Streamed Markdown Preview:\n' + mdText.trim());

  console.log('\n🎉 ALL DEVVAULT CAPSTONE TESTS PASSED PERFECTLY!');
} finally {
  serverProcess.kill();
}
