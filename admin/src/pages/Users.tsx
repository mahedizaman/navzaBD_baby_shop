import { useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Arif Rahman", email: "arif@gmail.com", role: "Admin" },
    { id: 2, name: "Sultana Kamal", email: "sultana@gmail.com", role: "User" },
    { id: 3, name: "Mahmudul Hasan", email: "mahmud@gmail.com", role: "User" },
    { id: 4, name: "Nusrat Jahan", email: "nusrat@gmail.com", role: "User" },
    { id: 5, name: "Tanvir Ahmed", email: "tanvir@gmail.com", role: "Editor" },
    { id: 6, name: "Sajid Islam", email: "sajid@gmail.com", role: "User" },
    { id: 7, name: "Farhana Akter", email: "farhana@gmail.com", role: "User" },
    { id: 8, name: "Rashed Khan", email: "rashed@gmail.com", role: "Editor" },
    { id: 9, name: "Mitu Chowdhury", email: "mitu@gmail.com", role: "User" },
    { id: 10, name: "Kamrul Islam", email: "kamrul@gmail.com", role: "User" },
  ]);

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">User List</h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{user.id}</td>
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">{user.role}</td>

                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
