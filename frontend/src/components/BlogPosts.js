import React, { useEffect, useState } from "react";
import BLOG_API from "../services/blog";
import BlogForm from "./BlogForm";

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);

  const loadPosts = () => {
    BLOG_API.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div>
      <h1>Blog</h1>
      <BlogForm onCreated={loadPosts} />
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogPosts;
