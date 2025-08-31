import FormData from 'form-data';
import fetch from 'node-fetch';

// Test against production backend
const PRODUCTION_API = 'https://backend.cosoltech.in/api';

console.log('🌐 Testing Production Backend Forms');
console.log('Production URL:', PRODUCTION_API);
console.log('='.repeat(50));

// Test Contact Form on Production
async function testProductionContactForm() {
  console.log('\n📧 Testing Contact Form on Production...');
  
  try {
    const response = await fetch(`${PRODUCTION_API}/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Production Test User',
        email: 'production.test@example.com',
        phone: '9876543210',
        subject: 'Testing Production Backend',
        message: 'This is a test to verify the production backend is working with the updated forms.'
      })
    });
    
    const result = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok && result.success) {
      console.log('✅ Production Contact Form: SUCCESS');
      console.log('   Contact ID:', result.contactId || 'Not provided');
      console.log('   Message:', result.message);
    } else {
      console.log('❌ Production Contact Form: FAILED');
      console.log('   Response:', result);
    }
    
  } catch (error) {
    console.log('❌ Production Contact Form: ERROR');
    console.log('   Error:', error.message);
    console.log('   This might indicate:');
    console.log('   1. Production server is down');
    console.log('   2. CORS issues');
    console.log('   3. Network connectivity issues');
  }
}

// Test Job Application Form on Production (without file)
async function testProductionJobApplication() {
  console.log('\n💼 Testing Job Application on Production (no file)...');
  
  try {
    const formData = new FormData();
    formData.append('fullName', 'Production Job Test');
    formData.append('email', 'production.job@example.com');
    formData.append('phone', '9876543210');
    formData.append('position', 'software-engineer');
    formData.append('experience', '2-3');
    formData.append('coverLetter', 'Testing production backend job application submission.');
    
    const response = await fetch(`${PRODUCTION_API}/job-applications/submit`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    const result = await response.json();
    
    console.log('Response Status:', response.status);
    
    if (response.ok && result.success) {
      console.log('✅ Production Job Application: SUCCESS');
      console.log('   Application ID:', result.applicationId || 'Not provided');
      console.log('   Message:', result.message);
    } else {
      console.log('❌ Production Job Application: FAILED');
      console.log('   Response:', result);
      
      if (result.errors) {
        console.log('   Validation Errors:');
        result.errors.forEach(err => {
          console.log(`   - ${err.path || err.param}: ${err.msg}`);
        });
      }
    }
    
  } catch (error) {
    console.log('❌ Production Job Application: ERROR');
    console.log('   Error:', error.message);
  }
}

// Test Job Application with File on Production
async function testProductionJobApplicationWithFile() {
  console.log('\n📎 Testing Job Application with File on Production...');
  
  try {
    const formData = new FormData();
    formData.append('fullName', 'Production Test With Resume');
    formData.append('email', 'production.resume@example.com');
    formData.append('phone', '9876543211');
    formData.append('position', 'marketing-executive');
    formData.append('experience', '1-3');
    formData.append('coverLetter', 'Testing file upload on production backend.');
    
    // Create a small test resume file
    const resumeContent = Buffer.from(`
RESUME - Production Test

Name: Production Test Applicant
Email: production.resume@example.com
Phone: 9876543211

Experience:
- Software Development: 2 years
- Project Management: 1 year

Skills:
- JavaScript, React, Node.js
- MongoDB, MySQL
- Project Leadership

This is a test resume for production backend validation.
    `.trim());
    
    formData.append('resume', resumeContent, {
      filename: 'production-test-resume.txt',
      contentType: 'text/plain'
    });
    
    const response = await fetch(`${PRODUCTION_API}/job-applications/submit`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    const result = await response.json();
    
    console.log('Response Status:', response.status);
    
    if (response.ok && result.success) {
      console.log('✅ Production Job Application (with file): SUCCESS');
      console.log('   Application ID:', result.applicationId || 'Not provided');
      console.log('   Message:', result.message);
      console.log('   File upload: ✅ Working');
    } else {
      console.log('❌ Production Job Application (with file): FAILED');
      console.log('   Response:', result);
      
      if (result.message && result.message.includes('File type')) {
        console.log('   💡 Tip: Production might have different file type restrictions');
      }
      if (result.message && result.message.includes('Unexpected file field')) {
        console.log('   💡 Tip: Production might not have the updated file upload middleware');
      }
    }
    
  } catch (error) {
    console.log('❌ Production Job Application (with file): ERROR');
    console.log('   Error:', error.message);
  }
}

// Check Production Server Health
async function checkProductionHealth() {
  console.log('\n🏥 Checking Production Server Health...');
  
  try {
    // Try a simple GET request to check if server is responding
    const response = await fetch(`${PRODUCTION_API}/health`, {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      console.log('✅ Production server is responding');
    } else {
      console.log('⚠️  Production server responded with status:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Production server health check failed:', error.message);
    
    // Try just the base URL
    try {
      const baseResponse = await fetch('https://backend.cosoltech.in', {
        method: 'GET',
        timeout: 5000
      });
      
      if (baseResponse.ok) {
        console.log('✅ Base production URL is accessible');
        console.log('   Issue might be with /api route or specific endpoints');
      }
    } catch (baseError) {
      console.log('❌ Base production URL is not accessible');
      console.log('   Production server might be down or unreachable');
    }
  }
}

// Run all production tests
async function runProductionTests() {
  console.log('🚀 Starting Production Backend Tests...\n');
  
  await checkProductionHealth();
  await testProductionContactForm();
  await testProductionJobApplication();
  await testProductionJobApplicationWithFile();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 Production Test Summary:');
  console.log('📍 Tested against: https://backend.cosoltech.in');
  console.log('🔍 Check results above for any issues');
  console.log('💡 If tests fail, production server might need:');
  console.log('   - Updated file upload middleware');  
  console.log('   - CORS configuration updates');
  console.log('   - Server restart to apply changes');
  console.log('='.repeat(50));
}

runProductionTests();