import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./Home.css";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/blog");
        setBlogs(res.data.data || []);
      } catch (err) {
        setError("Failed to fetch latest blogs. Make sure server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const userString = localStorage.getItem("user");
  let loggedInUser = null;
  if (userString) {
    try {
      loggedInUser = JSON.parse(userString);
    } catch (e) {
      console.error(e);
    }
  }

  const filteredBlogs = blogs
    .filter(blog => {
      if (loggedInUser && blog.author?._id === loggedInUser._id) {
        return false;
      }
      return true;
    })
    .filter(blog =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getFallbackImage = (imgUrl) => {
    return imgUrl && imgUrl.trim() !== "" ? imgUrl : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";
  };

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-glow"></div>
        <h1 className="hero-title">
          Discover the Art of <span className="text-gradient">Storytelling</span>
        </h1>
        <p className="hero-subtitle">
          Explore articles on technology, design, travel, and lifestyle written by our creative community.
        </p>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search blogs by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Main Blog Feed */}
      <div className="feed-section">
        <h2 className="feed-title">Latest Publications</h2>
        
        {loading ? (
          <div className="status-container">
            <div className="spinner"></div>
            <p>Loading the latest stories...</p>
          </div>
        ) : error ? (
          <div className="status-container">
            <div className="error-badge">{error}</div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="status-container">
            <p className="no-blogs">No stories found. Be the first to share yours!</p>
            <Link to="/create-blog" className="btn btn-primary" style={{ marginTop: "15px" }}>Create a Blog</Link>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredBlogs.map((blog) => (
              <article key={blog._id} className="blog-card glass-card">
                <div className="card-image-wrap">
                  <img
                    src={getFallbackImage(blog.image)}
                    alt={blog.title}
                    loading="lazy"
                  />
                  <div className="card-badge">Article</div>
                </div>

                <div className="card-body">
                  <div className="card-meta">
                    <span className="card-author">✍️ {blog.author?.name || "Anonymous"}</span>
                    <span className="card-date">• {formatDate(blog.createdAt)}</span>
                  </div>

                  <h3 className="card-title">{blog.title}</h3>

                  <p className="card-excerpt">
                    {blog.content.length > 120
                      ? blog.content.substring(0, 120) + "..."
                      : blog.content}
                  </p>

                  <div className="card-footer">
                    <Link to={`/blog/${blog._id}`} className="read-more-btn">
                      Read Article <span className="arrow">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;