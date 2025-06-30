import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
  });
  const [message, setMessage] = useState('');

  const fetchExpense = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://budgetbuddy-backend-1-uut1.onrender.com/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { title, amount, category, date } = res.data;
      setFormData({
        title,
        amount,
        category,
        date: date.split('T')[0], // Format for input type="date"
      });
    } catch (error) {
      setMessage('Failed to fetch expense data.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://budgetbuddy-backend-1-uut1.onrender.com/api/expenses/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Expense updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage('Failed to update expense.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Edit Expense</h2>

        {message && (
          <div className="text-center text-sm text-blue-600 font-medium">{message}</div>
        )}

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Others">Others</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Update Expense
        </button>
      </form>
    </div>
  );
};

export default EditExpense;
