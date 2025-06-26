import React, { useState } from "react";
import BLOG_API from "../services/blog";

const BlogForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await BLOG_API.post("/posts", form);
      alert("Article créé !");
      setForm({ title: "", content: "" });
      onCreated(); // pour recharger la liste
    } catch (err) {
      alert("Erreur lors de la création");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer un nouveau billet</h2>
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Titre"
        required
      />
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Contenu"
        required
      />
      <button type="submit">Publier</button>
    </form>
  );
};

export default BlogForm;
