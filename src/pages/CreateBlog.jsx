import { useState } from "react";
import axios from "axios";

function CreateBlog() {
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    image: "",
  });

  const handleChange = (e) => {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  const submitBlog = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:3000/blog/create",
      blog
    );

    alert("Blog Created");
  };

  return (
    <div className="form-container">
      <form onSubmit={submitBlog}>
        <h2>Create Blog</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
        />

        <textarea
          rows="8"
          name="content"
          placeholder="Content"
          onChange={handleChange}
        />

        <button>Create</button>
      </form>
    </div>
  );
}

export default CreateBlog;