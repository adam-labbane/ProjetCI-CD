import axios from "axios";

const BLOG_API_BASE_URL = process.env.REACT_APP_BLOG_API_URL || "http://localhost:5000";

const blogAPI = axios.create({
  baseURL: BLOG_API_BASE_URL,
});

export default blogAPI;
