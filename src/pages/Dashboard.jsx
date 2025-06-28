// client/src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [chart, setChart] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      navigate("/");
    }
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/expenses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExpenses(res.data);
      renderChart(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/expenses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchExpenses();
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  const handleEdit = (expense) => {
    localStorage.setItem("editExpense", JSON.stringify(expense));
    navigate("/add-expense");
  };

  const renderChart = (data) => {
    const categoryMap = {};

    data.forEach((expense) => {
      if (categoryMap[expense.category]) {
        categoryMap[expense.category] += expense.amount;
      } else {
        categoryMap[expense.category] = expense.amount;
      }
    });

    const labels = Object.keys(categoryMap);
    const amounts = Object.values(categoryMap);

    if (chart) {
      chart.destroy();
    }

    const newChart = new Chart(document.getElementById("expenseChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Expenses by Category",
            data: amounts,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
    });

    setChart(newChart);
  };

  useEffect(() => {
    fetchUser();
    fetchExpenses();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name}</h2>

      <button className="add-expense-button" onClick={() => navigate("/add-expense")}>
        ➕ Add Expense
      </button>

      <h3>Your Expenses</h3>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense._id} className="expense-item">
              <div>
                <strong>{expense.title}</strong> - ₹{expense.amount} | {expense.category} | {new Date(expense.date).toLocaleDateString()}
              </div>
              <div className="expense-actions">
                <button onClick={() => handleEdit(expense)} className="edit-btn">✏️ Edit</button>
                <button onClick={() => handleDelete(expense._id)} className="delete-btn">🗑️ Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="chart-container">
        <h3>Expense Analytics</h3>
        <canvas id="expenseChart" width="600" height="300"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;
