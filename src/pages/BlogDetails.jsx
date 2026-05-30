import { useParams } from "react-router-dom";

function BlogDetails() {
  const { id } = useParams();

  return (
    <div style={{ padding: "50px" }}>
      <h1>Blog Details</h1>
      <p>Blog Id : {id}</p>
    </div>
  );
}

export default BlogDetails;