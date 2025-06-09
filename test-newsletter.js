#!/usr/bin/env node

// Simple test script for the newsletter API
// Run with: node test-newsletter.js

const API_URL = 'http://localhost:9002/api/newsletter';

async function testNewsletter() {
  console.log('🧪 Testing Newsletter API...\n');

  // Test 1: Valid email
  console.log('Test 1: Valid email subscription');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    const result = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Test 2: Invalid email
  console.log('Test 2: Invalid email format');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'invalid-email' })
    });
    
    const result = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }

  // Test 3: Missing email
  console.log('Test 3: Missing email');
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    
    const result = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    console.log(`Error: ${error.message}\n`);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testNewsletter().catch(console.error);
}

module.exports = testNewsletter;
