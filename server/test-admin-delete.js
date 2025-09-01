import fetch from 'node-fetch';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

// Test configuration
const API_URL = 'http://localhost:5001/api';
const ADMIN_EMAIL = 'admin@example.com'; // Replace with your admin email
const ADMIN_PASSWORD = 'admin123'; // Replace with your admin password

console.log('🗑️ Testing Admin Delete Functionality');
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

// Create test contact
async function createTestContact() {
  console.log('\n📝 Creating test contact...');
  
  try {
    const response = await fetch(`${API_URL}/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Delete User',
        email: 'delete.test@example.com',
        phone: '9999999999',
        subject: 'Test Contact for Deletion',
        message: 'This is a test contact that will be deleted by admin.'
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Test contact created:', result.contactId);
      return result.contactId;
    } else {
      console.log('❌ Failed to create test contact:', result.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error creating contact:', error.message);
    return null;
  }
}

// Create test job application
async function createTestJobApplication() {
  console.log('\n📝 Creating test job application...');
  
  try {
    const formData = new FormData();
    formData.append('fullName', 'Test Delete Applicant');
    formData.append('email', 'delete.job@example.com');
    formData.append('phone', '8888888888');
    formData.append('position', 'Test Position');
    formData.append('experience', '1-3');
    formData.append('coverLetter', 'This is a test application that will be deleted.');
    
    // Add a test resume
    const resumeContent = Buffer.from('Test Resume Content for Deletion Test');
    formData.append('resume', resumeContent, {
      filename: 'test-delete-resume.txt',
      contentType: 'text/plain'
    });
    
    const response = await fetch(`${API_URL}/job-applications/submit`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Test job application created:', result.applicationId);
      return result.applicationId;
    } else {
      console.log('❌ Failed to create test application:', result.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error creating application:', error.message);
    return null;
  }
}

// Test delete single contact
async function testDeleteContact(token, contactId) {
  if (!contactId) {
    console.log('\n⚠️  No contact ID to test deletion');
    return false;
  }
  
  console.log(`\n🗑️ Testing delete contact: ${contactId}`);
  
  try {
    const response = await fetch(`${API_URL}/contact/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Contact deleted successfully');
      
      // Verify deletion
      const checkResponse = await fetch(`${API_URL}/contact/${contactId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (checkResponse.status === 404) {
        console.log('✅ Deletion verified - contact not found');
        return true;
      } else {
        console.log('⚠️  Contact still exists after deletion');
        return false;
      }
    } else {
      console.log('❌ Failed to delete contact:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error deleting contact:', error.message);
    return false;
  }
}

// Test delete single job application
async function testDeleteJobApplication(token, applicationId) {
  if (!applicationId) {
    console.log('\n⚠️  No application ID to test deletion');
    return false;
  }
  
  console.log(`\n🗑️ Testing delete job application: ${applicationId}`);
  
  try {
    const response = await fetch(`${API_URL}/job-applications/${applicationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Job application and resume deleted successfully');
      
      // Verify deletion
      const checkResponse = await fetch(`${API_URL}/job-applications/${applicationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (checkResponse.status === 404) {
        console.log('✅ Deletion verified - application not found');
        return true;
      } else {
        console.log('⚠️  Application still exists after deletion');
        return false;
      }
    } else {
      console.log('❌ Failed to delete application:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error deleting application:', error.message);
    return false;
  }
}

// Test delete multiple contacts
async function testDeleteMultipleContacts(token) {
  console.log('\n🗑️ Testing delete multiple contacts...');
  
  // Create multiple test contacts
  const contactIds = [];
  for (let i = 0; i < 3; i++) {
    const id = await createTestContact();
    if (id) contactIds.push(id);
  }
  
  if (contactIds.length === 0) {
    console.log('⚠️  No test contacts created for bulk deletion');
    return false;
  }
  
  console.log(`   Created ${contactIds.length} test contacts for bulk deletion`);
  
  try {
    const response = await fetch(`${API_URL}/contact/delete-multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: contactIds })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log(`✅ Bulk delete successful: ${result.deletedCount} contacts deleted`);
      return true;
    } else {
      console.log('❌ Failed to delete multiple contacts:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error deleting multiple contacts:', error.message);
    return false;
  }
}

// Test delete multiple job applications
async function testDeleteMultipleApplications(token) {
  console.log('\n🗑️ Testing delete multiple job applications...');
  
  // Create multiple test applications
  const applicationIds = [];
  for (let i = 0; i < 3; i++) {
    const id = await createTestJobApplication();
    if (id) applicationIds.push(id);
  }
  
  if (applicationIds.length === 0) {
    console.log('⚠️  No test applications created for bulk deletion');
    return false;
  }
  
  console.log(`   Created ${applicationIds.length} test applications for bulk deletion`);
  
  try {
    const response = await fetch(`${API_URL}/job-applications/delete-multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: applicationIds })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log(`✅ Bulk delete successful: ${result.deletedCount} applications deleted`);
      return true;
    } else {
      console.log('❌ Failed to delete multiple applications:', result.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error deleting multiple applications:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Admin Delete Functionality Tests...\n');
  
  // Login as admin
  const token = await loginAsAdmin();
  
  if (!token) {
    console.log('\n❌ Cannot proceed without admin authentication');
    return;
  }
  
  // Create test data
  const contactId = await createTestContact();
  const applicationId = await createTestJobApplication();
  
  // Test single deletions
  const contactDeleted = await testDeleteContact(token, contactId);
  const applicationDeleted = await testDeleteJobApplication(token, applicationId);
  
  // Test bulk deletions
  const bulkContactsDeleted = await testDeleteMultipleContacts(token);
  const bulkApplicationsDeleted = await testDeleteMultipleApplications(token);
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 Test Summary:');
  console.log(contactDeleted ? '✅' : '❌', 'Delete single contact');
  console.log(applicationDeleted ? '✅' : '❌', 'Delete single job application (with resume)');
  console.log(bulkContactsDeleted ? '✅' : '❌', 'Delete multiple contacts');
  console.log(bulkApplicationsDeleted ? '✅' : '❌', 'Delete multiple job applications');
  console.log('\n📌 Admin Delete Features:');
  console.log('• Admin can delete individual contacts');
  console.log('• Admin can delete individual job applications');
  console.log('• Deleting job application also removes associated resume');
  console.log('• Admin can bulk delete multiple contacts');
  console.log('• Admin can bulk delete multiple applications');
  console.log('='.repeat(50));
}

runTests();