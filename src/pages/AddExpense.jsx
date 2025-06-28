import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddExpense = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/expenses`,
        { title, amount, category, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Expense added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to add expense", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Save Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
