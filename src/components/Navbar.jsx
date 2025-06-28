import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const isLoggedIn = localStorage.getItem("loggedInUser");

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        {isLoggedIn && (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/add-expense" className="hover:underline">
              Add Expense
            </Link>
          </>
        )}
      </div>

      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
