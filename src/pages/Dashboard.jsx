function Dashboard() {
  return (
    <div style={{ padding: "50px" }}>
      <h1>Dashboard</h1>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Title</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>React Blog</td>
            <td>
              <button>Edit</button>
            </td>
            <td>
              <button>Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;