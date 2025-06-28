// client/src/pages/EditExpense.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditExpense = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchExpense = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/expenses/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { title, amount, category } = res.data;
      setTitle(title);
      setAmount(amount);
      setCategory(category);
    };
    fetchExpense();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(
      `${process.env.REACT_APP_API_URL}/expenses/${id}`,
      { title, amount, category },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Edit Expense</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full mb-3 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-full mb-3 p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className="w-full mb-3 p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Other</option>
        </select>
        <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
          Update Expense
        </button>
      </form>
    </div>
  );
};

export default EditExpense;
