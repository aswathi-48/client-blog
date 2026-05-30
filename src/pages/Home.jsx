import React from 'react'
import "./Home.css";


const Home = () => {
  return (
     <div className="home">
      <h1>Latest Blogs</h1>

      <div className="blog-grid">
        <div className="blog-card">
          <img
            src="https://picsum.photos/400/200"
            alt=""
          />

          <h3>React Blog</h3>

          <p>
            Learn React from beginner to advanced...
          </p>

          <button>Read More</button>
        </div>
      </div>
    </div>
  )
}

export default Home