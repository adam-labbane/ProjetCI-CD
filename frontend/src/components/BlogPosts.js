import React, { useEffect, useState } from "react";
import blogAPI from "../services/blogApi";

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    blogAPI.get("/posts")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des billets");
        console.error(err);
      });
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Billets de blog</h2>
      {posts.length === 0 ? (
        <p>Aucun billet pour le moment.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>Publié le : {new Date(post.createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogPosts;
