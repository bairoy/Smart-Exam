import PropTypes from "prop-types";

const Table = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No data available</p>;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <table className="table table-responsive">
      <thead>
        <tr>
          <th>Exam Name</th>
          <th>Exam Date</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Exam Link</th>
          <th>School</th>
        </tr>
      </thead>
      <tbody>
        {data.map((exam) => (
          <tr key={exam.id}>
            <td>{exam.examname || "N/A"}</td>
            <td>{exam.examdate ? formatDate(exam.examdate) : "N/A"}</td>
            <td>{exam.starttime || "N/A"}</td>
            <td>{exam.endtime || "N/A"}</td>
            <td>
              {exam.examlink ? (
                <a
                  href={exam.examlink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Link
                </a>
              ) : (
                "N/A"
              )}
            </td>
            <td>{exam.school || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      examname: PropTypes.string,
      examdate: PropTypes.string,
      starttime: PropTypes.string,
      endtime: PropTypes.string,
      examlink: PropTypes.string,
      school: PropTypes.string,
    })
  ).isRequired,
};

export default Table;
