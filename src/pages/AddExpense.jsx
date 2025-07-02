import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, category, date } = formData;

    if (!title || !amount || !category || !date) {
      setMessage('⚠️ Please fill in all fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('⚠️ No token found. Please log in again.');
        return;
      }

      const payload = {
        title,
        amount: Number(amount),
        category,
        date,
      };

      await axios.post(
        'https://budgetbuddy-backend-1-uut1.onrender.com/api/expenses',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('✅ Expense added successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('❌ Failed to add expense:', error.response?.data || error.message);
      setMessage('❌ Failed to add expense. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Add New Expense</h2>

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
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
