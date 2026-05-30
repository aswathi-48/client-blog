import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { showToast } from "../components/Toast";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      showToast("Please login to edit your blogs", "error");
      navigate("/login");
      return;
    }

    const fetchBlogDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/blog/${id}`);
        const data = res.data.data;
        
        // Ensure user is the author
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        if (data.author?._id !== user?._id) {
          showToast("Unauthorized! You can only edit your own blogs.", "error");
          navigate("/dashboard");
          return;
        }

        setBlog({
          title: data.title,
          content: data.content,
          image: data.image || "",
        });
      } catch (err) {
        setError("Failed to fetch blog details");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id, navigate, token]);

  const handleChange = (e) => {
    setError("");
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setError("");
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setBlog((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.onerror = () => {
        setError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setBlog((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();

    if (!blog.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!blog.content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      setSaving(true);
      await axios.put(
        `http://localhost:3000/blog/${id}`,
        blog,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast("Blog Updated Successfully", "success");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update blog"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="status-container" style={{ minHeight: "60vh" }}>
        <div className="spinner"></div>
        <p>Loading blog editor...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Edit Blog Post</h2>
        <p className="subtitle">Update your article details below</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submitEdit}>
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={blog.title}
            onChange={handleChange}
            required
          />

          {blog.image ? (
            <div className="image-preview-container">
              <img src={blog.image} alt="Selected preview" />
              <button
                type="button"
                className="btn remove-image-btn"
                onClick={removeImage}
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div className="file-input-wrapper">
              <label className="file-input-label">
                <span>📷 Choose Cover Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          )}

          <textarea
            rows="8"
            name="content"
            placeholder="Write your blog post content here..."
            value={blog.content}
            onChange={handleChange}
            required
          />

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => navigate("/dashboard")}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" style={{ flex: 2 }} disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBlog;
