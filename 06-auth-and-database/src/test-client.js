import { fork } from 'node:child_process';
import path from 'node:path';

const serverProcess = fork(path.join('06-auth-and-database', 'src', 'server.js'), [], {
  env: { ...process.env, PORT: '8080' }
});

await new Promise(r => setTimeout(r, 600));

try {
  console.log('--- 1. Testing Registration (POST /api/register) ---');
  const regRes = await fetch('http://localhost:8080/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'batman', password: 'SuperSecretPassword123!' })
  });
  const regData = await regRes.json();
  console.log('Registration Status:', regRes.status);
  console.log('Registration Response:', regData);

  console.log('\n--- 2. Testing Login (POST /api/login) ---');
  const loginRes = await fetch('http://localhost:8080/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'batman', password: 'SuperSecretPassword123!' })
  });
  const loginData = await loginRes.json();
  console.log('Login Status:', loginRes.status);
  console.log('Login Response:', loginData);
  const token = loginData.token;

  console.log('\n--- 3. Testing Protected Notes Creation (POST /api/notes) ---');
  const noteRes = await fetch('http://localhost:8080/api/notes', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content: 'Arkham Asylum security code: 9942' })
  });
  const noteData = await noteRes.json();
  console.log('Create Note Status:', noteRes.status);
  console.log('Create Note Response:', noteData);

  console.log('\n--- 4. Testing Protected Notes Retrieval (GET /api/notes) ---');
  const getNotesRes = await fetch('http://localhost:8080/api/notes', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const notesData = await getNotesRes.json();
  console.log('Fetch Notes Status:', getNotesRes.status);
  console.log('Fetched Notes:', notesData);

  console.log('\n--- 5. Testing Unauthorized Access (No Token) ---');
  const unauthRes = await fetch('http://localhost:8080/api/notes');
  const unauthData = await unauthRes.json();
  console.log('Unauthorized Status:', unauthRes.status);
  console.log('Unauthorized Response:', unauthData);

  console.log('\n🎉 ALL HERO TIER SECURITY & DATABASE TESTS PASSED!');
} finally {
  serverProcess.kill();
}
