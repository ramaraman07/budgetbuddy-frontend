import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/expenses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses(res.data);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchUser();
      fetchExpenses();
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Welcome, {user?.name}</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <h3>Your Expenses</h3>
      <button onClick={() => navigate("/add-expense")} style={styles.addBtn}>
        ➕ Add Expense
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <p style={styles.noExpenses}>No expenses found.</p>
      ) : (
        <div style={styles.expenseList}>
          {expenses.map((expense) => (
            <div key={expense._id} style={styles.expenseItem}>
              <p>
                <strong>{expense.title}</strong> - ₹{expense.amount}
              </p>
              <p style={styles.date}>
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  logoutBtn: {
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  addBtn: {
    marginBottom: "20px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  expenseList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  expenseItem: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  date: {
    color: "#888",
    fontSize: "14px",
  },
  noExpenses: {
    color: "#555",
    fontStyle: "italic",
    marginTop: "20px",
  },
};

export default Dashboard;
