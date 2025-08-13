import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log('Testing hospital login...');
    
    const response = await fetch('http://localhost:5001/auth/hospital-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hospitalName: 'Apollo Hospital Bannerghatta',
        password: '12345'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('Response:', data);
    } else {
      console.log('❌ Login failed');
      console.log('Error:', data);
    }
    
  } catch (error) {
    console.error('Request failed:', error);
  }
}

testLogin();
