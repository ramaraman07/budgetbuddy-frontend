// client/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/");
    fetchUser();
    fetchExpenses();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const chartData = {
    labels: expenses.map((exp) => exp.title),
    datasets: [
      {
        label: "Amount",
        data: expenses.map((exp) => exp.amount),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Welcome, {user?.name || "User"}
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Expenses</h2>
          <Link
            to="/add-expense"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            + Add Expense
          </Link>
        </div>

        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses found.</p>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div
                key={expense._id}
                className="bg-white shadow p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-medium">{expense.title}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{expense.amount} | {expense.category}
                  </p>
                </div>
                <div className="space-x-2">
                  <Link
                    to={`/edit-expense/${expense._id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Expense Chart</h3>
          {expenses.length > 0 ? (
            <Bar data={chartData} />
          ) : (
            <p className="text-gray-400 text-sm">No data for chart</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
