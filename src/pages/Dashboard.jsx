// client/src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/profile`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        navigate("/");
      }
    };

    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${API_URL}/expenses`, {
          withCredentials: true,
        });
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
    };

    fetchUser();
    fetchExpenses();
  }, [navigate, API_URL]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>💸 Welcome, {user.name}</h1>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={() => navigate("/add-expense")}>
          ➕ Add Expense
        </button>
        <button style={{ ...styles.button, backgroundColor: "#ff4d4d" }} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <h2 style={styles.subHeader}>Your Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount (₹)</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.amount}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    fontSize: "32px",
    marginBottom: "20px",
    color: "#333",
  },
  subHeader: {
    fontSize: "24px",
    marginTop: "40px",
    marginBottom: "15px",
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 18px",
    fontSize: "16px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
    borderRadius: "4px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
};

export default Dashboard;
