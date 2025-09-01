import fetch from 'node-fetch';

// Test production authentication
const PRODUCTION_API = 'https://backend.cosoltech.in/api';

console.log('🔐 Testing Production Authentication');
console.log('Production URL:', PRODUCTION_API);
console.log('='.repeat(50));

// Test health check first
async function testHealthCheck() {
  console.log('\n🏥 Testing health endpoint...');
  
  try {
    const response = await fetch(`${PRODUCTION_API}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Health check passed:', result);
    } else {
      const text = await response.text();
      console.log('❌ Health check failed:', text);
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
  }
}

// Test login endpoint
async function testLogin() {
  console.log('\n🔑 Testing login endpoint...');
  
  const testCredentials = {
    email: 'admin@example.com',
    password: 'admin123'
  };
  
  console.log('Test credentials:', { email: testCredentials.email, password: '***' });
  
  try {
    const response = await fetch(`${PRODUCTION_API}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testCredentials)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Raw response:', text);
    
    try {
      const result = JSON.parse(text);
      if (response.ok) {
        console.log('✅ Login response:', result);
      } else {
        console.log('❌ Login failed:', result);
      }
    } catch (parseError) {
      console.log('❌ Response is not JSON:', text);
    }
    
  } catch (error) {
    console.log('❌ Login request error:', error.message);
    console.log('Error details:', error);
  }
}

// Test auth routes availability
async function testAuthRoutes() {
  console.log('\n📍 Testing auth routes availability...');
  
  const routes = [
    { method: 'GET', path: '/auth' },
    { method: 'POST', path: '/auth/login' },
    { method: 'POST', path: '/auth/register' }
  ];
  
  for (const route of routes) {
    try {
      const response = await fetch(`${PRODUCTION_API}${route.path}`, {
        method: route.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: route.method === 'POST' ? JSON.stringify({}) : undefined
      });
      
      console.log(`${route.method} ${route.path}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`${route.method} ${route.path}: ERROR - ${error.message}`);
    }
  }
}

// Check CORS configuration
async function testCORS() {
  console.log('\n🌐 Testing CORS configuration...');
  
  try {
    const response = await fetch(`${PRODUCTION_API}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://cosoltech.in',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('CORS preflight status:', response.status);
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
      'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
    };
    
    console.log('CORS headers:', corsHeaders);
    
    if (corsHeaders['access-control-allow-origin']) {
      console.log('✅ CORS is configured');
    } else {
      console.log('⚠️  CORS might not be properly configured');
    }
    
  } catch (error) {
    console.log('❌ CORS test error:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Production Authentication Tests...\n');
  
  await testHealthCheck();
  await testAuthRoutes();
  await testCORS();
  await testLogin();
  
  console.log('\n' + '='.repeat(50));
  console.log('🔍 Troubleshooting Guide:');
  console.log('1. Check Vercel deployment logs for errors');
  console.log('2. Verify environment variables are set:');
  console.log('   - MONGODB_URI');
  console.log('   - JWT_SECRET');
  console.log('   - NODE_ENV=production');
  console.log('3. Check if auth routes are being loaded correctly');
  console.log('4. Verify database connection in production');
  console.log('5. Check server.js auth route import logic');
  console.log('='.repeat(50));
}

runTests();