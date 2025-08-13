import fetch from 'node-fetch';

async function testHospitalsAPI() {
  try {
    console.log('Testing /api/hospitals endpoint...');
    
    const response = await fetch('http://localhost:5001/api/hospitals');
    
    if (response.ok) {
      const hospitals = await response.json();
      console.log('✅ API working! Found', hospitals.length, 'hospitals');
      console.log('First few hospitals:');
      hospitals.slice(0, 3).forEach(h => console.log(`- ${h.name}`));
    } else {
      console.log('❌ API failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

testHospitalsAPI();
