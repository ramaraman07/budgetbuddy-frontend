import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch {
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
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchUser();
    fetchExpenses();
  }, []);

  return (
    <div className="dashboard-container">
      <header>
        <h2>Welcome, {user.name}</h2>
        <div>
          <button onClick={() => navigate("/add-expense")}>➕ Add Expense</button>
          <button onClick={handleLogout}>🚪 Logout</button>
        </div>
      </header>

      <section className="expenses-list">
        <h3>Your Expenses</h3>
        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          expenses.map((exp) => (
            <div key={exp._id} className="expense-card">
              <h4>{exp.title}</h4>
              <p>💸 Amount: ₹{exp.amount}</p>
              <p>🗓️ Date: {new Date(exp.date).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;
