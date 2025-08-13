import mongoose from 'mongoose';
import Hospital from '../models/Hospital.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the parent directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Sample hospital data - Real Bangalore hospitals within 50km radius of (13.032643, 77.5920005)
const sampleHospitals = [
  {
    name: "Apollo Hospital Bannerghatta",
    email: "admin@apollo-bannerghatta.com",
    address: "154/11, Opposite IIM, Bannerghatta Road, Bangalore, Karnataka 560076",
    location: {
      type: "Point",
      coordinates: [77.6081, 12.8897]
    },
    contactPhone: "+91-80-2612-2121",
    services: ["Emergency", "Cardiology", "Neurosurgery", "Pediatrics", "ICU"],
    isVerified: true
  },
  {
    name: "Aster CMI Hospital",
    email: "admin@astercmi.com",
    address: "No. 43/2, New Airport Road, NH.7, Sahakara Nagar, Bangalore, Karnataka 560092",
    location: {
      type: "Point",
      coordinates: [77.6567, 13.0827]
    },
    contactPhone: "+91-80-4342-0100",
    services: ["Emergency", "Cardiology", "Neurology", "Oncology", "ICU"],
    isVerified: true
  },
  {
    name: "Aster RV Hospital",
    email: "admin@asterrv.com",
    address: "CA-37, 24th Main, 1st Phase, J.P. Nagar, Bangalore, Karnataka 560078",
    location: {
      type: "Point",
      coordinates: [77.5833, 12.9167]
    },
    contactPhone: "+91-80-6692-6692",
    services: ["Emergency", "Cardiology", "Neurology", "Orthopedics", "ICU"],
    isVerified: true
  },
  {
    name: "Bangalore Baptist Hospital",
    email: "admin@baptisthospital.com",
    address: "Bellary Road, Hebbal, Bangalore, Karnataka 560024",
    location: {
      type: "Point",
      coordinates: [77.5922, 13.0358]
    },
    contactPhone: "+91-80-2212-4265",
    services: ["Emergency", "General Medicine", "Surgery", "Pediatrics", "ICU"],
    isVerified: true
  },
  {
    name: "BGS Gleneagles Global Hospital",
    email: "admin@bgsgleneagles.com",
    address: "67, Uttarahalli Road, Kengeri, Bangalore, Karnataka 560060",
    location: {
      type: "Point",
      coordinates: [77.4836, 12.9181]
    },
    contactPhone: "+91-80-4955-5555",
    services: ["Emergency", "Liver Transplant", "Cardiology", "Nephrology", "ICU"],
    isVerified: true
  },
  {
    name: "Bhagawan Mahaveer Jain Hospital",
    email: "admin@bmjhospital.com",
    address: "Millers Road, Vasanth Nagar, Bangalore, Karnataka 560052",
    location: {
      type: "Point",
      coordinates: [77.5922, 12.9838]
    },
    contactPhone: "+91-80-2227-9191",
    services: ["Emergency", "Cardiology", "Neurology", "Orthopedics", "ICU"],
    isVerified: true
  },
  {
    name: "Brindavan Hospital",
    email: "admin@brindavanhospital.com",
    address: "Old Madras Road, Bangalore, Karnataka 560016",
    location: {
      type: "Point",
      coordinates: [77.6567, 12.9915]
    },
    contactPhone: "+91-80-2549-0505",
    services: ["Emergency", "General Medicine", "Surgery", "Cardiology", "ICU"],
    isVerified: true
  },
  {
    name: "Chinmaya Mission Hospital",
    email: "admin@chinmayahospital.com",
    address: "No.1, Indira Nagar 2nd Stage, Bangalore, Karnataka 560038",
    location: {
      type: "Point",
      coordinates: [77.6413, 12.9796]
    },
    contactPhone: "+91-80-2520-0100",
    services: ["Emergency", "General Medicine", "Surgery", "Cardiology", "ICU"],
    isVerified: true
  },
  {
    name: "Cloudnine Hospital Bellandur",
    email: "admin@cloudnine-bellandur.com",
    address: "Outer Ring Road, Bellandur, Bangalore, Karnataka 560103",
    location: {
      type: "Point",
      coordinates: [77.6826, 12.9339]
    },
    contactPhone: "+91-80-6144-9999",
    services: ["Emergency", "Maternity", "Pediatrics", "Neonatology", "ICU"],
    isVerified: true
  },
  {
    name: "Cloudnine Hospital Jayanagar",
    email: "admin@cloudnine-jayanagar.com",
    address: "1533, 9th Main, 16th Cross, 4th T Block, Jayanagar, Bangalore, Karnataka 560041",
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9279]
    },
    contactPhone: "+91-80-6599-6599",
    services: ["Emergency", "Maternity", "Pediatrics", "Neonatology", "ICU"],
    isVerified: true
  },
  {
    name: "Columbia Asia Hospital Hebbal",
    email: "admin@columbia-hebbal.com",
    address: "Kirloskar Business Park, Bellary Road, Hebbal, Bangalore, Karnataka 560024",
    location: {
      type: "Point",
      coordinates: [77.5922, 13.0358]
    },
    contactPhone: "+91-80-6614-6666",
    services: ["Emergency", "Cardiology", "Pediatrics", "Orthopedics", "ICU"],
    isVerified: true
  },
  {
    name: "Columbia Asia Hospital Whitefield",
    email: "admin@columbia-whitefield.com",
    address: "Survey No. 10P & 12P, Ramagondanahalli, Varthur Hobli, Whitefield, Bangalore, Karnataka 560066",
    location: {
      type: "Point",
      coordinates: [77.7499, 12.9699]
    },
    contactPhone: "+91-80-6614-9000",
    services: ["Emergency", "Cardiology", "Neurology", "Orthopedics", "ICU"],
    isVerified: true
  },
  {
    name: "Deepak Hospital",
    email: "admin@deepakhospital.com",
    address: "Vijayanagar, Bangalore, Karnataka 560040",
    location: {
      type: "Point",
      coordinates: [77.5378, 12.9726]
    },
    contactPhone: "+91-80-2330-0088",
    services: ["Emergency", "General Medicine", "Surgery", "Pediatrics", "ICU"],
    isVerified: true
  },
  {
    name: "Fortis Hospital Bannerghatta Road",
    email: "admin@fortis-bannerghatta.com", 
    address: "154/9, Bannerghatta Road, Opposite IIM, Bangalore, Karnataka 560076",
    location: {
      type: "Point",
      coordinates: [77.6081, 12.8897]
    },
    contactPhone: "+91-80-6621-4444",
    services: ["Emergency", "Trauma", "Cardiology", "Orthopedics", "ICU"],
    isVerified: true
  },
  {
    name: "Fortis Hospital Cunningham Road",
    email: "admin@fortis-cunningham.com",
    address: "14, Cunningham Road, Bangalore, Karnataka 560052",
    location: {
      type: "Point",
      coordinates: [77.5922, 12.9915]
    },
    contactPhone: "+91-80-6214-4444",
    services: ["Emergency", "Cardiology", "Neurology", "Orthopedics", "ICU"],
    isVerified: true
  },
  {
    name: "Fortis Hospital Rajajinagar",
    email: "admin@fortis-rajajinagar.com",
    address: "111, West of Chord Road, Opp. BMTC Bus Depot, Rajajinagar, Bangalore, Karnataka 560010",
    location: {
      type: "Point",
      coordinates: [77.5492, 12.9916]
    },
    contactPhone: "+91-80-4095-4095",
    services: ["Emergency", "Cardiology", "Neurology", "Orthopedics", "ICU"],
    isVerified: true
  },
  {
    name: "HCG Cancer Centre KR Road",
    email: "admin@hcg-krroad.com",
    address: "8, P. Kalinga Rao Road, Near Dobson Road, Bangalore, Karnataka 560027",
    location: {
      type: "Point",
      coordinates: [77.5833, 12.9667]
    },
    contactPhone: "+91-80-4660-7000",
    services: ["Emergency", "Oncology", "Radiation Therapy", "Surgery", "ICU"],
    isVerified: true
  },
  {
    name: "Hosmat Hospital",
    email: "admin@hosmathospital.com",
    address: "45, Magrath Road, Bangalore, Karnataka 560025",
    location: {
      type: "Point",
      coordinates: [77.6088, 12.9722]
    },
    contactPhone: "+91-80-2227-9595",
    services: ["Emergency", "Orthopedics", "Sports Medicine", "Neurology", "ICU"],
    isVerified: true
  },
  {
    name: "JSS Hospital",
    email: "admin@jsshospital.com",
    address: "JSS Medical College, S.S. Nagara, Mysore Road, Bangalore, Karnataka 560015",
    location: {
      type: "Point",
      coordinates: [77.5492, 12.9167]
    },
    contactPhone: "+91-80-2649-9999",
    services: ["Emergency", "General Medicine", "Surgery", "Pediatrics", "ICU"],
    isVerified: true
  },
  {
    name: "Kauvery Hospital Electronic City",
    email: "admin@kauvery-ec.com",
    address: "Survey no 92/1B Hewlett Packard Avenue, Konappana Agrahara Electronic City, Bangalore, Karnataka 560100",
    location: {
      type: "Point",
      coordinates: [77.6648, 12.8394]
    },
    contactPhone: "+91-80-6801-6801",
    services: ["Emergency", "Cardiology", "Neurology", "Oncology", "ICU"],
    isVerified: true
  },
  {
    name: "Koshys Hospital",
    email: "admin@koshyshospital.com",
    address: "27/28, Off Vittal Mallya Road, Bangalore, Karnataka 560001",
    location: {
      type: "Point",
      coordinates: [77.6033, 12.9716]
    },
    contactPhone: "+91-80-4152-2200",
    services: ["Emergency", "General Medicine", "Surgery", "Orthopedics", "ICU"],
    isVerified: true
  },
  {
    name: "M.S. Ramaiah Memorial Hospital",
    email: "admin@msramaiah.com",
    address: "New BEL Road, MSRIT Post, Bangalore, Karnataka 560054",
    location: {
      type: "Point",
      coordinates: [77.5644, 13.0126]
    },
    contactPhone: "+91-80-2360-4050",
    services: ["Emergency", "Cardiology", "Neurology", "Orthopedics", "ICU"],
    isVerified: true
  },
  {
    name: "Mallya Hospital",
    email: "admin@mallyahospital.com",
    address: "No. 2, Vittal Mallya Road, Bangalore, Karnataka 560001",
    location: {
      type: "Point",
      coordinates: [77.6033, 12.9716]
    },
    contactPhone: "+91-80-2227-9979",
    services: ["Emergency", "General Medicine", "Surgery", "Gynecology", "ICU"],
    isVerified: true
  },
  {
    name: "Manipal Hospital HAL Airport Road",
    email: "admin@manipal-hal.com",
    address: "98, HAL Airport Road, Bangalore, Karnataka 560017",
    location: {
      type: "Point",
      coordinates: [77.6649, 12.9611]
    },
    contactPhone: "+91-80-2502-4444",
    services: ["Emergency", "Cardiology", "Orthopedics", "Gastroenterology", "ICU"],
    isVerified: true
  },
  {
    name: "Manipal Hospital Whitefield",
    email: "admin@manipal-whitefield.com",
    address: "#143, 212-2015, EPIP Industrial Area, Whitefield, Bangalore, Karnataka 560066",
    location: {
      type: "Point",
      coordinates: [77.7499, 12.9699]
    },
    contactPhone: "+91-80-6692-2222",
    services: ["Emergency", "Cardiology", "Neurology", "Oncology", "ICU"],
    isVerified: true
  },
  {
    name: "Motherhood Hospital Indiranagar",
    email: "admin@motherhood-indiranagar.com",
    address: "#1635, 2nd Floor, 12th Main, HAL 2nd Stage, Indiranagar, Bangalore, Karnataka 560038",
    location: {
      type: "Point",
      coordinates: [77.6413, 12.9796]
    },
    contactPhone: "+91-80-4144-9999",
    services: ["Emergency", "Maternity", "Pediatrics", "Neonatology", "ICU"],
    isVerified: true
  },
  {
    name: "Motherhood Hospital Whitefield",
    email: "admin@motherhood-whitefield.com",
    address: "Survey No 55/3, Kadugodi, Whitefield, Bangalore, Karnataka 560067",
    location: {
      type: "Point",
      coordinates: [77.7499, 12.9699]
    },
    contactPhone: "+91-80-6214-9999",
    services: ["Emergency", "Maternity", "Pediatrics", "Neonatology", "ICU"],
    isVerified: true
  },
  {
    name: "NIMHANS",
    email: "admin@nimhans.com",
    address: "Hosur Road, Bangalore, Karnataka 560029",
    location: {
      type: "Point",
      coordinates: [77.5945, 12.9435]
    },
    contactPhone: "+91-80-2699-5555",
    services: ["Emergency", "Neurology", "Psychiatry", "Neurosurgery", "ICU"],
    isVerified: true
  },
  {
    name: "Narayana Health City",
    email: "admin@narayana-healthcity.com",
    address: "258/A, Bommasandra Industrial Area, Anekal Taluk, Bangalore, Karnataka 560099",
    location: {
      type: "Point",
      coordinates: [77.6648, 12.8051]
    },
    contactPhone: "+91-80-7122-2222",
    services: ["Emergency", "Cardiac Surgery", "Transplants", "Oncology", "ICU"],
    isVerified: true
  },
  {
    name: "Narayana Multispeciality Hospital HSR Layout",
    email: "admin@narayana-hsr.com",
    address: "HSR Layout, Bangalore, Karnataka 560102",
    location: {
      type: "Point",
      coordinates: [77.6387, 12.9081]
    },
    contactPhone: "+91-80-6802-6802",
    services: ["Emergency", "Cardiology", "Neurology", "Gastroenterology", "ICU"],
    isVerified: true
  },
  {
    name: "People Tree Hospitals",
    email: "admin@peopletreehospitals.com",
    address: "No.2, Balaji Layout, Bannerghatta Road, Bangalore, Karnataka 560076",
    location: {
      type: "Point",
      coordinates: [77.6081, 12.8897]
    },
    contactPhone: "+91-80-4153-6666",
    services: ["Emergency", "General Medicine", "Surgery", "Pediatrics", "ICU"],
    isVerified: true
  },
  {
    name: "Ramaiah Medical College Hospital",
    email: "admin@ramaiahmedical.com",
    address: "P.O. Box 5787, MSRIT Post, Bangalore, Karnataka 560054",
    location: {
      type: "Point",
      coordinates: [77.5644, 13.0126]
    },
    contactPhone: "+91-80-2360-4050",
    services: ["Emergency", "General Medicine", "Surgery", "Pediatrics", "ICU"],
    isVerified: true
  },
  {
    name: "Rins Institute of Medical Sciences",
    email: "admin@rinshospital.com",
    address: "Rajarajeshwari Nagar, Ring Road, Bangalore, Karnataka 560098",
    location: {
      type: "Point",
      coordinates: [77.5167, 12.9167]
    },
    contactPhone: "+91-80-2849-2849",
    services: ["Emergency", "General Medicine", "Surgery", "Pediatrics", "ICU"],
    isVerified: true
  },
  {
    name: "Sagar Hospital BTM Layout",
    email: "admin@sagar-btm.com",
    address: "44/54, 30th Cross, 4th T Block, Jayanagar Extension, BTM Layout, Bangalore, Karnataka 560076",
    location: {
      type: "Point",
      coordinates: [77.6088, 12.9167]
    },
    contactPhone: "+91-80-2661-8888",
    services: ["Emergency", "Cardiology", "Neurology", "Orthopedics", "ICU"],
    isVerified: true
  },
  {
    name: "Sagar Hospital Kumaraswamy Layout",
    email: "admin@sagar-kumaraswamy.com",
    address: "No. 44/54, 30th Cross, Kumaraswamy Layout, Bangalore, Karnataka 560078",
    location: {
      type: "Point",
      coordinates: [77.5378, 12.9167]
    },
    contactPhone: "+91-80-2661-8888",
    services: ["Emergency", "Cardiology", "Neurology", "Orthopedics", "ICU"],
    isVerified: true
  },
  {
    name: "Sakra World Hospital",
    email: "admin@sakraworldhospital.com",
    address: "52/2, Devarabeesanahalli, Outer Ring Road, Bangalore, Karnataka 560103",
    location: {
      type: "Point",
      coordinates: [77.6826, 12.9339]
    },
    contactPhone: "+91-80-4969-4969",
    services: ["Emergency", "Multi-Organ Transplant", "Cardiology", "Oncology", "ICU"],
    isVerified: true
  },
  {
    name: "Santosh Hospital",
    email: "admin@santoshhospital.com",
    address: "1st Cross, Off Intermediate Ring Road, J.P. Nagar 3rd Phase, Bangalore, Karnataka 560078",
    location: {
      type: "Point",
      coordinates: [77.5833, 12.9167]
    },
    contactPhone: "+91-80-2649-8888",
    services: ["Emergency", "General Medicine", "Surgery", "Cardiology", "ICU"],
    isVerified: true
  },
  {
    name: "Shanti Hospital",
    email: "admin@shantihospital.com",
    address: "16, Shankar Nagar, Kammanahalli Main Road, Bangalore, Karnataka 560084",
    location: {
      type: "Point",
      coordinates: [77.6413, 13.0126]
    },
    contactPhone: "+91-80-2847-4444",
    services: ["Emergency", "General Medicine", "Surgery", "Gynecology", "ICU"],
    isVerified: true
  },
  {
    name: "Sparsh Hospital Marathahalli",
    email: "admin@sparsh-marathahalli.com",
    address: "146, Opposite BMTC Bus Depot, KHB Colony, 5th Block, Koramangala, Bangalore, Karnataka 560095",
    location: {
      type: "Point",
      coordinates: [77.6826, 12.9352]
    },
    contactPhone: "+91-80-4344-4444",
    services: ["Emergency", "Orthopedics", "Neurology", "Spine Surgery", "ICU"],
    isVerified: true
  },
  {
    name: "St. John's Medical College Hospital",
    email: "admin@stjohns.com",
    address: "Sarjapur Road, Bangalore, Karnataka 560034",
    location: {
      type: "Point",
      coordinates: [77.6070, 12.9279]
    },
    contactPhone: "+91-80-4955-4955",
    services: ["Emergency", "General Medicine", "Surgery", "Pediatrics", "ICU"],
    isVerified: true
  },
  {
    name: "Suguna Hospital",
    email: "admin@sugunahospital.com",
    address: "5/1, Lavelle Road, Bangalore, Karnataka 560001",
    location: {
      type: "Point",
      coordinates: [77.6033, 12.9716]
    },
    contactPhone: "+91-80-2227-7979",
    services: ["Emergency", "General Medicine", "Surgery", "Gynecology", "ICU"],
    isVerified: true
  },
  {
    name: "Trinity Hospital",
    email: "admin@trinityhospital.com",
    address: "7th Main, 4th Cross, R.T. Nagar, Bangalore, Karnataka 560032",
    location: {
      type: "Point",
      coordinates: [77.5922, 13.0126]
    },
    contactPhone: "+91-80-2333-0033",
    services: ["Emergency", "General Medicine", "Surgery", "Pediatrics", "ICU"],
    isVerified: true
  },
  {
    name: "Vikram Hospital",
    email: "admin@vikramhospital.com",
    address: "No.70/1, Millers Road, Opposite St. Anne's College, Bangalore, Karnataka 560052",
    location: {
      type: "Point",
      coordinates: [77.5922, 12.9838]
    },
    contactPhone: "+91-80-4055-5555",
    services: ["Emergency", "Cardiology", "Nephrology", "Urology", "ICU"],
    isVerified: true
  },
  {
    name: "Yashomati Hospital",
    email: "admin@yashomatihospital.com",
    address: "26/4, Brigade Road, Bangalore, Karnataka 560025",
    location: {
      type: "Point",
      coordinates: [77.6088, 12.9722]
    },
    contactPhone: "+91-80-2559-9999",
    services: ["Emergency", "General Medicine", "Surgery", "Gynecology", "ICU"],
    isVerified: true
  }
];

async function populateHospitals() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing hospitals
    await Hospital.deleteMany({});
    console.log('Cleared existing hospitals');

    // Insert sample hospitals
    const insertedHospitals = await Hospital.insertMany(sampleHospitals);
    console.log(`Inserted ${insertedHospitals.length} hospitals`);

    // Create 2dsphere index for geospatial queries
    await Hospital.createIndexes();
    console.log('Created geospatial indexes');

    console.log('Sample hospitals populated successfully!');
    
  } catch (error) {
    console.error('Error populating hospitals:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

populateHospitals();
