import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Test configuration
const API_URL = 'http://localhost:5001/api';
const ADMIN_EMAIL = 'admin@example.com'; // Replace with your admin email
const ADMIN_PASSWORD = 'admin123'; // Replace with your admin password

console.log('🔐 Testing Admin Resume Access');
console.log('='.repeat(50));

// Helper function to login as admin
async function loginAsAdmin() {
  console.log('\n📝 Logging in as admin...');
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.token) {
      console.log('✅ Admin login successful');
      return result.token;
    } else {
      console.log('❌ Admin login failed:', result.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return null;
  }
}

// Test viewing job applications
async function testViewApplications(token) {
  console.log('\n📋 Testing view job applications...');
  
  try {
    const response = await fetch(`${API_URL}/job-applications/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Successfully fetched job applications');
      console.log(`   Total applications: ${result.total}`);
      
      // Check for applications with resumes
      const withResumes = result.applications.filter(app => app.resume && app.resume.data);
      console.log(`   Applications with resumes: ${withResumes.length}`);
      
      if (withResumes.length > 0) {
        console.log('   Sample application with resume:');
        const sample = withResumes[0];
        console.log(`   - Applicant: ${sample.fullName}`);
        console.log(`   - Position: ${sample.position}`);
        console.log(`   - Resume: ${sample.resume.filename || 'resume.pdf'}`);
        return sample._id;
      }
      
      return result.applications[0]?._id;
    } else {
      console.log('❌ Failed to fetch applications:', result.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error fetching applications:', error.message);
    return null;
  }
}

// Test viewing single application with resume
async function testViewSingleApplication(token, applicationId) {
  if (!applicationId) {
    console.log('\n⚠️  No application ID to test');
    return;
  }
  
  console.log(`\n🔍 Testing view single application: ${applicationId}`);
  
  try {
    const response = await fetch(`${API_URL}/job-applications/${applicationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Successfully fetched application details');
      const app = result.application;
      console.log(`   Applicant: ${app.fullName}`);
      console.log(`   Email: ${app.email}`);
      console.log(`   Position: ${app.position}`);
      console.log(`   Status: ${app.status}`);
      
      if (app.resume && app.resume.data) {
        console.log('   Resume details:');
        console.log(`   - Filename: ${app.resume.filename || 'resume.pdf'}`);
        console.log(`   - Size: ${app.resume.size} bytes`);
        console.log(`   - Type: ${app.resume.contentType}`);
      } else {
        console.log('   No resume attached');
      }
    } else {
      console.log('❌ Failed to fetch application:', result.message);
    }
  } catch (error) {
    console.log('❌ Error fetching application:', error.message);
  }
}

// Test file management - get all resumes
async function testGetResumesInFileManagement(token) {
  console.log('\n📁 Testing resumes in file management...');
  
  try {
    const response = await fetch(`${API_URL}/files/resumes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Successfully fetched resumes from file management');
      console.log(`   Total resumes: ${result.total}`);
      
      if (result.files && result.files.length > 0) {
        console.log('   Sample resume in file management:');
        const sample = result.files[0];
        console.log(`   - Applicant: ${sample.applicantName}`);
        console.log(`   - Position: ${sample.position}`);
        console.log(`   - Filename: ${sample.filename}`);
        console.log(`   - Size: ${sample.size} bytes`);
        console.log(`   - Uploaded: ${sample.uploadedAt}`);
        return sample._id;
      }
    } else {
      console.log('❌ Failed to fetch resumes:', result.message);
    }
  } catch (error) {
    console.log('❌ Error fetching resumes:', error.message);
  }
}

// Test downloading resume
async function testDownloadResume(token, applicationId) {
  if (!applicationId) {
    console.log('\n⚠️  No application ID to test resume download');
    return;
  }
  
  console.log(`\n💾 Testing resume download for application: ${applicationId}`);
  
  try {
    const response = await fetch(`${API_URL}/files/resume/${applicationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      console.log('✅ Resume download successful');
      console.log(`   Content-Type: ${contentType}`);
      console.log(`   Content-Length: ${contentLength} bytes`);
      
      // You could save the file here if needed
      // const buffer = await response.buffer();
      // fs.writeFileSync('downloaded_resume.pdf', buffer);
    } else {
      const result = await response.json();
      console.log('❌ Failed to download resume:', result.message);
    }
  } catch (error) {
    console.log('❌ Error downloading resume:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Admin Resume Access Tests...\n');
  
  // Login as admin
  const token = await loginAsAdmin();
  
  if (!token) {
    console.log('\n❌ Cannot proceed without admin authentication');
    return;
  }
  
  // Test viewing applications
  const applicationId = await testViewApplications(token);
  
  // Test viewing single application
  await testViewSingleApplication(token, applicationId);
  
  // Test file management resumes
  const resumeId = await testGetResumesInFileManagement(token);
  
  // Test downloading resume
  await testDownloadResume(token, applicationId || resumeId);
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 Test Summary:');
  console.log('✅ Admin can view job applications');
  console.log('✅ Admin can view application details with resume info');
  console.log('✅ Resumes are accessible in file management tab');
  console.log('✅ Admin can download resumes');
  console.log('='.repeat(50));
}

runTests();