import styles from "./Today.module.css";
const Today = () => {
  const now = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  // console.log(now.toLocaleDateString(undefined, options)); // e.g., September 11, 2024
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return (
    <>
      <center></center>
      <h1>{now.toLocaleDateString(undefined, options)}</h1>
      <center>
        <h1>{daysOfWeek[now.getDay()]}</h1>
      </center>
    </>
  );
};
export default Today;
