import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://budgetbuddy-backend-1-uut1.onrender.com/api/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://budgetbuddy-backend-1-uut1.onrender.com/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://budgetbuddy-backend-1-uut1.onrender.com/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (error) {
      console.error('Failed to delete expense', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchExpenses();
  }, []);

  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const chartData = {
    labels: expenses.map((exp) => exp.category),
    datasets: [
      {
        label: 'Expenses by Category',
        data: expenses.map((exp) => exp.amount),
        backgroundColor: [
          '#60a5fa', '#f87171', '#34d399', '#fbbf24', '#c084fc',
          '#fb7185', '#4ade80', '#38bdf8', '#facc15',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name || 'User'} 👋
          </h1>
          <button
            onClick={() => navigate('/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Expense
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <p className="text-lg">No expenses found 💸</p>
            <p className="text-sm">Start by adding your first expense</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Expenses</h2>
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Amount (₹)</th>
                    <th className="py-2 px-4">Category</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{exp.title}</td>
                      <td className="py-2 px-4">₹{exp.amount}</td>
                      <td className="py-2 px-4">{exp.category}</td>
                      <td className="py-2 px-4">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 flex gap-2 justify-center">
                        <button
                          onClick={() => navigate(`/edit/${exp._id}`)}
                          className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(exp._id)}
                          className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-right text-gray-700 font-medium">
                Total Spent: ₹{totalExpense}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Bar Chart</h3>
                <Bar data={chartData} />
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Pie Chart</h3>
                <Pie data={chartData} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
