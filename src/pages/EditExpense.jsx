import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";

const EditExpense = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: state.title,
    amount: state.amount,
    category: state.category,
    date: new Date(state.date).toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/expenses/${state._id}`, formData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to update expense:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Edit Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Expense
        </button>
      </form>
    </div>
  );
};

export default EditExpense;
