import fetch from 'node-fetch';

const testUrls = [
  'https://backend.cosoltech.in/api/health',
  'https://backend.cosoltech.in/api/cors-test'
];

const testOrigin = 'https://cosoltech.in';

async function testCORS() {
  console.log('Testing CORS configuration...\n');
  
  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Origin': testOrigin,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Status: ${response.status}`);
      console.log(`CORS Headers:`);
      console.log(`  Access-Control-Allow-Origin: ${response.headers.get('access-control-allow-origin')}`);
      console.log(`  Access-Control-Allow-Methods: ${response.headers.get('access-control-allow-methods')}`);
      console.log(`  Access-Control-Allow-Headers: ${response.headers.get('access-control-allow-headers')}`);
      console.log(`  Access-Control-Allow-Credentials: ${response.headers.get('access-control-allow-credentials')}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Response:`, data);
      } else {
        console.log(`Error: ${response.statusText}`);
      }
      
      console.log('---\n');
      
    } catch (error) {
      console.error(`Error testing ${url}:`, error.message);
      console.log('---\n');
    }
  }
}

testCORS();
