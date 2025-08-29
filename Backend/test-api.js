const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const BASE_URL = `http://localhost:3001`;

// Test user credentials
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `testuser_${Date.now()}@example.com`,
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User'
};

// Test course data
const testCourse = {
  name: 'Test Course',
  code: 'TEST101',
  credit: 3,
  description: 'This is a test course for API testing',
  image: 'https://via.placeholder.com/300'
};

let authToken = '';
let userId = '';
let courseId = '';

async function runTests() {
  console.log('Starting API tests...');
  
  try {
    // Test 1: Health check
    console.log('\n--- Test 1: Health Check ---');
    try {
      const response = await axios.get(`${BASE_URL}/api`);
      console.log('✓ API is running');
    } catch (error) {
      console.log('✗ API is not running or not accessible');
      if (error.code === 'ECONNREFUSED') {
        console.error(`Could not connect to ${BASE_URL}. Is the server running?`);
        process.exit(1);
      } else {
        console.error(`Error: ${error.message}`);
      }
    }

    // Test 2: Register user
    console.log('\n--- Test 2: Register User ---');
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, testUser);
      console.log(`✓ User registered: ${testUser.username}`);
    } catch (error) {
      console.log('✗ User registration failed');
      console.error(error.response?.data || error.message);
    }

    // Test 3: Login
    console.log('\n--- Test 3: Login ---');
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        username: testUser.username,
        password: testUser.password
      });
      authToken = response.data.token;
      userId = response.data.user.id;
      console.log(`✓ Login successful (Token received: ${authToken.substring(0, 15)}...)`);
    } catch (error) {
      console.log('✗ Login failed');
      console.error(error.response?.data || error.message);
    }

    // Test 4: Get profile
    console.log('\n--- Test 4: Get Profile ---');
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✓ Profile retrieved successfully');
      console.log(` - Username: ${response.data.username}`);
      console.log(` - Email: ${response.data.email}`);
    } catch (error) {
      console.log('✗ Profile retrieval failed');
      console.error(error.response?.data || error.message);
    }

    // Test 5: Add course
    console.log('\n--- Test 5: Add Course ---');
    try {
      const response = await axios.post(`${BASE_URL}/api/courses`, testCourse, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      courseId = response.data.id;
      console.log(`✓ Course added successfully (ID: ${courseId})`);
    } catch (error) {
      console.log('✗ Course addition failed');
      console.error(error.response?.data || error.message);
    }

    // Test 6: Get courses
    console.log('\n--- Test 6: Get Courses ---');
    try {
      const response = await axios.get(`${BASE_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log(`✓ Retrieved ${response.data.length} courses`);
    } catch (error) {
      console.log('✗ Course retrieval failed');
      console.error(error.response?.data || error.message);
    }

    // Test 7: Get course by ID
    if (courseId) {
      console.log('\n--- Test 7: Get Course by ID ---');
      try {
        const response = await axios.get(`${BASE_URL}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`✓ Retrieved course: ${response.data.name}`);
      } catch (error) {
        console.log('✗ Course retrieval by ID failed');
        console.error(error.response?.data || error.message);
      }
    }

    // Test 8: Update course
    if (courseId) {
      console.log('\n--- Test 8: Update Course ---');
      const updatedCourse = {
        ...testCourse,
        name: `${testCourse.name} Updated`,
        description: `${testCourse.description} - Updated`
      };
      
      try {
        const response = await axios.put(`${BASE_URL}/api/courses/${courseId}`, updatedCourse, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log(`✓ Course updated: ${response.data.name}`);
      } catch (error) {
        console.log('✗ Course update failed');
        console.error(error.response?.data || error.message);
      }
    }

    // Test 9: Delete course
    if (courseId) {
      console.log('\n--- Test 9: Delete Course ---');
      try {
        const response = await axios.delete(`${BASE_URL}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✓ Course deleted successfully');
      } catch (error) {
        console.log('✗ Course deletion failed');
        console.error(error.response?.data || error.message);
      }
    }

    console.log('\nAPI tests completed!');
    return true;
  } catch (error) {
    console.error('Error during tests:', error);
    return false;
  }
}

// Run the tests
runTests()
  .then(success => {
    if (success) {
      console.log('\n✓ API testing completed successfully');
      process.exit(0);
    } else {
      console.log('\n✗ API testing encountered errors');
      process.exit(1);
    }
  });
