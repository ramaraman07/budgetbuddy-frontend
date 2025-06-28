// client/src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      navigate("/");
    }
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
      setError("Something went wrong while fetching expenses.");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchExpenses();
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Welcome, {user?.name || "User"} 🎉</h2>
        <Link to="/add-expense" style={styles.addButton}>+ Add Expense</Link>
      </div>

      <div style={styles.content}>
        <h3 style={styles.subtitle}>Your Expenses</h3>

        {error && <p style={styles.error}>{error}</p>}
        {expenses.length === 0 ? (
          <p style={styles.noData}>No expenses found.</p>
        ) : (
          <div style={styles.grid}>
            {expenses.map((expense) => (
              <div key={expense._id} style={styles.card}>
                <h4 style={styles.cardTitle}>{expense.title}</h4>
                <p style={styles.cardAmount}>₹{expense.amount}</p>
                <p style={styles.cardDate}>{new Date(expense.date).toLocaleDateString()}</p>
                <p style={styles.cardCategory}>Category: {expense.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 18px",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "16px",
  },
  content: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  subtitle: {
    fontSize: "22px",
    marginBottom: "20px",
    color: "#555",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  noData: {
    fontSize: "18px",
    color: "#888",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "18px",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#222",
  },
  cardAmount: {
    fontSize: "16px",
    color: "#007bff",
    marginBottom: "6px",
  },
  cardDate: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "4px",
  },
  cardCategory: {
    fontSize: "14px",
    color: "#666",
  },
};

export default Dashboard;
