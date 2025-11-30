// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const { isAuthenticated, logout } = useAuth();
//   const navigate = useNavigate();

//   const [todos, setTodos] = useState([]);
//   const [title, setTitle] = useState("");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!isAuthenticated) return navigate("/login");
//     fetchTodos();
//   }, []);

//   // GET todos
//   const fetchTodos = async () => {
//     const res = await fetch("http://localhost:5000/api/todos", {
//       headers: { Authorization: "Bearer " + token },
//     });

//     const data = await res.json();
//     setTodos(Array.isArray(data) ? data : []);
//   };

//   // ADD todo
//   const addTodo = async (e) => {
//     e.preventDefault();

//     const res = await fetch("http://localhost:5000/api/todos", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//       body: JSON.stringify({ title }),
//     });

//     const data = await res.json();
//     setTodos([data, ...todos]);
//     setTitle("");
//   };

//   // TOGGLE todo
//   const toggleTodo = async (id) => {
//     const res = await fetch(`http://localhost:5000/api/todos/${id}/toggle`, {
//       method: "PATCH",
//       headers: { Authorization: "Bearer " + token },
//     });

//     const updated = await res.json();
//     setTodos(todos.map((t) => (t._id === id ? updated : t)));
//   };

//   // DELETE todo
//   const deleteTodo = async (id) => {
//     await fetch(`http://localhost:5000/api/todos/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: "Bearer " + token },
//     });

//     setTodos(todos.filter((t) => t._id !== id));
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-12 bg-white p-8 shadow-lg rounded-2xl border border-gray-100">

//       {/* HEADER + LOGOUT */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
//           Your Todo List
//         </h1>

//         <button
//           onClick={() => {
//             logout();
//             navigate("/login");
//           }}
//           className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all text-sm shadow"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Add Todo */}
//       <form
//         className="flex gap-3 mb-6 bg-gray-100 p-3 rounded-xl border"
//         onSubmit={addTodo}
//       >
//         <input
//           className="flex-1 border-none bg-transparent focus:ring-0 outline-none px-2"
//           placeholder="Add a new task..."
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <button className="px-5 py-2 bg-black hover:bg-gray-900 text-white rounded-lg transition-all shadow">
//           Add
//         </button>
//       </form>

//       {/* Todo List */}
//       <ul className="space-y-3">
//         {todos.map((todo) => (
//           <li
//             key={todo._id}
//             className="flex items-center justify-between p-4 border rounded-xl shadow-sm hover:shadow transition-all"
//           >
//             <div className="flex items-center gap-3">
//               <input
//                 type="checkbox"
//                 checked={todo.completed}
//                 onChange={() => toggleTodo(todo._id)}
//                 className="w-5 h-5 accent-purple-600"
//               />

//               <span
//                 className={`${
//                   todo.completed
//                     ? "line-through text-gray-400"
//                     : "text-gray-800"
//                 } font-medium`}
//               >
//                 {todo.title}
//               </span>
//             </div>

//             <button
//               onClick={() => deleteTodo(todo._id)}
//               className="text-red-500 hover:text-red-700 text-sm font-semibold"
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Dashboard;



import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GET todos
  const fetchTodos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch todos error:", err);
    }
  };

  // ADD todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();
      setTodos([data, ...todos]);
      setTitle("");
    } catch (err) {
      console.error("Add todo error:", err);
    }
  };

  // START edit
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditingTitle(todo.title);
  };

  // CANCEL edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  // SAVE edit
  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title: editingTitle }),
      });

      const updated = await res.json();

      setTodos(todos.map((t) => (t._id === id ? updated : t)));
      cancelEdit();
    } catch (err) {
      console.error("Edit todo error:", err);
    }
  };

  // TOGGLE todo
  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: "Bearer " + token },
      });

      const updated = await res.json();
      setTodos(todos.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("Toggle todo error:", err);
    }
  };

  // DELETE todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete todo error:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 shadow-lg rounded-2xl border border-gray-100">

      {/* HEADER + LOGOUT */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Your Todo List
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay organized and track your tasks easily ✨
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all text-sm shadow"
        >
          Logout
        </button>
      </div>

      {/* Add Todo */}
      <form
        className="flex gap-3 mb-6 bg-gray-100 p-3 rounded-xl border"
        onSubmit={addTodo}
      >
        <input
          className="flex-1 border-none bg-transparent focus:ring-0 outline-none px-2 text-sm"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className="px-5 py-2 bg-black hover:bg-gray-900 text-white rounded-lg transition-all shadow text-sm">
          Add
        </button>
      </form>

      {/* Todo List */}
      <ul className="space-y-3">
        {todos.map((todo) => {
          const isEditing = editingId === todo._id;

          return (
            <li
              key={todo._id}
              className="flex items-center justify-between p-4 border rounded-xl shadow-sm hover:shadow-md transition-all bg-gray-50"
            >
              <div className="flex items-center gap-3">
                {!isEditing && (
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo._id)}
                    className="w-5 h-5 accent-purple-600"
                  />
                )}

                {isEditing ? (
                  <input
                    className="border px-2 py-1 rounded-md text-sm w-full"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                  />
                ) : (
                  <span
                    className={`${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    } font-medium`}
                  >
                    {todo.title}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 text-sm">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveEdit(todo._id)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(todo)}
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-xs rounded-md transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-md transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {todos.length === 0 && (
        <p className="text-center text-gray-400 mt-6 text-sm">
          No tasks yet. Start by adding one! 🚀
        </p>
      )}
    </div>
  );
};

export default Dashboard;
