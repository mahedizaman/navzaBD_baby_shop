import { useState } from "react";

const Account = () => {
  const [users, setUsers] = useState([
    { userId: 1, userName: "Arif Rahman", userEmail: "arif@example.com" },
    { userId: 2, userName: "Sultana Kamal", userEmail: "sultana@example.com" },
    { userId: 3, userName: "Mahmudul Hasan", userEmail: "mahmud@example.com" },
    { userId: 4, userName: "Nusrat Jahan", userEmail: "nusrat@example.com" },
    { userId: 5, userName: "Tanvir Ahmed", userEmail: "tanvir@example.com" },
    { userId: 6, userName: "Sajid Islam", userEmail: "sajid@example.com" },
    { userId: 7, userName: "Farhana Akter", userEmail: "farhana@example.com" },
    { userId: 8, userName: "Rashed Khan", userEmail: "rashed@example.com" },
    { userId: 9, userName: "Mitu Chowdhury", userEmail: "mitu@example.com" },
    { userId: 10, userName: "Kamrul Islam", userEmail: "kamrul@example.com" },
  ]);

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.userId !== id);
    setUsers(updatedUsers);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        User Account List
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-6 text-left">User ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="text-gray-600">
            {users.map((user) => (
              <tr
                key={user.userId}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6 font-medium">{user.userId}</td>
                <td className="py-4 px-6">{user.userName}</td>
                <td className="py-4 px-6">{user.userEmail}</td>

                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => handleDelete(user.userId)}
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

export default Account;
