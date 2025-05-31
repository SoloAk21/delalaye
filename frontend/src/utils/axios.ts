import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Use environment variables for configuration
  timeout: 10000, // Set a timeout for requests (adjust as needed)
});

export default instance;
