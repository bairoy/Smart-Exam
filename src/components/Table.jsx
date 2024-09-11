import "bootstrap/dist/css/bootstrap.min.css";
const Table = () => {
  return (
    <div className="container mt-5">
      <table className="table-borderless">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>30</td>
            <td>New York</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jane Smith</td>
            <td>25</td>
            <td>Los Angeles</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Mike Johnson</td>
            <td>35</td>
            <td>Chicago</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Table;
