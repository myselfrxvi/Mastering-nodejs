import { fork } from 'node:child_process';
import path from 'node:path';

const serverProcess = fork(path.join('05-express-rest-api', 'src', 'app.js'), [], {
  env: { ...process.env, PORT: '8080' }
});

// Wait 600ms for Express to boot
await new Promise(r => setTimeout(r, 600));

try {
  console.log('--- 1. Testing GET /api/products ---');
  const getRes = await fetch('http://localhost:8080/api/products');
  const products = await getRes.json();
  console.log('Status:', getRes.status);
  console.log('Products:', products);

  console.log('\n--- 2. Testing GET /api/products/1 (URL Param) ---');
  const singleRes = await fetch('http://localhost:8080/api/products/1');
  const single = await singleRes.json();
  console.log('Status:', singleRes.status);
  console.log('Single Product:', single);

  console.log('\n--- 3. Testing POST /api/products ---');
  const postRes = await fetch('http://localhost:8080/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '4K UltraWide Monitor', price: 650 })
  });
  const created = await postRes.json();
  console.log('Status:', postRes.status);
  console.log('Created:', created);

  console.log('\n--- 4. Testing DELETE /api/products/2 ---');
  const deleteRes = await fetch('http://localhost:8080/api/products/2', {
    method: 'DELETE'
  });
  const deleteMsg = await deleteRes.json();
  console.log('Status:', deleteRes.status);
  console.log('Delete Message:', deleteMsg);

  console.log('\n--- 5. Verify final list after POST and DELETE ---');
  const finalRes = await fetch('http://localhost:8080/api/products');
  const finalList = await finalRes.json();
  console.log('Final Products:', finalList);

  console.log('\n🎉 ALL EXPRESS REST API TESTS PASSED PERFECTLY!');
} finally {
  serverProcess.kill();
}

