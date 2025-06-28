// client/src/pages/AddExpense.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/expenses`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>➕ Add New Expense</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Expense Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={formData.amount}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g. Food, Travel)"
          value={formData.category}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>Save Expense</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "60px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fafafa",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    fontFamily: "Segoe UI, sans-serif",
  },
  heading: {
    textAlign: "center",
    fontSize: "26px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#28a745",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default AddExpense;
