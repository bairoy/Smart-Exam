import pool from "../models/db.js";

export const addExam = async (req, res) => {
  const { examName, examDate, startTime, endTime, examLink, school } = req.body;

  if (
    !examName ||
    !examDate ||
    !startTime ||
    !endTime ||
    !examLink ||
    !school
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO examlist (examName, examDate, startTime, endTime, examLink, school) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [examName, examDate, startTime, endTime, examLink, school]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error adding exam:", error);
    if (error.code === "23505") {
      res
        .status(409)
        .json({
          success: false,
          message: "An exam with this name already exists.",
        });
    } else {
      res
        .status(500)
        .json({
          success: false,
          message: "An error occurred while adding the exam.",
        });
    }
  }
};

export const getExamDetail = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM examlist`);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching exam details:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while fetching exam details.",
      });
  }
};
