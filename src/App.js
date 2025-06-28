// client/src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-expense"
          element={
            <PrivateRoute>
              <AddExpense />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-expense/:id"
          element={
            <PrivateRoute>
              <EditExpense />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
