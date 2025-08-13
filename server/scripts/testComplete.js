import fetch from 'node-fetch';

async function testHospitalLogin() {
  try {
    console.log('Testing hospital login with password "12345"...');
    
    // Test with Apollo Hospital Bannerghatta
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

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Hospital login successful!');
      console.log('Hospital data:', {
        name: data.hospital?.name,
        email: data.hospital?.email,
        type: data.hospital?.type
      });
    } else {
      const errorData = await response.json();
      console.log('❌ Login failed with status:', response.status);
      console.log('Error:', errorData);
    }
    
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

// Test both API endpoints
async function testAll() {
  console.log('=== Testing Hospitals API ===');
  try {
    const response = await fetch('http://localhost:5001/api/hospitals');
    if (response.ok) {
      const hospitals = await response.json();
      console.log('✅ Hospitals API working! Found', hospitals.length, 'hospitals');
      
      if (hospitals.length > 0) {
        console.log('First hospital:', hospitals[0].name);
        console.log('\n=== Testing Hospital Login ===');
        await testHospitalLogin();
      }
    } else {
      console.log('❌ Hospitals API failed with status:', response.status);
    }
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAll();
