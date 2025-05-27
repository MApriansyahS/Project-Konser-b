import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../auth/UseAuth";
import axios from "../api/AxiosInstance";
import { BASE_URL } from "../utils/utils.js";

const AdminDashboard = () => {
  const { accessToken, refreshAccessToken, logout} = useAuth();
  const [selectedTable, setSelectedTable] = useState("user"); // Default: admin
  const [UsersData, setUsersData] = useState([]);
  const [pengunjungData, setPengunjungData] = useState([]);


  const fetchUsersData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsersData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching User data:", error);
    }
  };

  const fetchPengunjungData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/pengunjung`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPengunjungData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pengunjung data:", error);
    }
  };

  useEffect(() => {
    fetchUsersData();
    fetchPengunjungData();
  }, [accessToken]);

  return (
    <>
      <nav
        className="navbar is-primary"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-menu is-active">
          <div className="navbar-start">
            <Link to="/AdminKonser" className="navbar-item">
              Konser
            </Link>
            <Link to="/AdminTiket" className="navbar-item">
              Tiket
            </Link>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a href="/logout" className="button is-light">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          {/* Buttons to toggle between tables */}
          <div className="flex gap-4 my-8">
            <button
              onClick={() => setSelectedTable("user")}
              className={`px-4 py-2 rounded ${
                selectedTable === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Tabel User
            </button>
            <button
              onClick={() => setSelectedTable("pengunjung")}
              className={`px-4 py-2 rounded ${
                selectedTable === "pengunjung"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Tabel Pengunjung
            </button>
          </div>

          {/* Conditional rendering of tables */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {selectedTable === "user" ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Data User</h2>
                {UsersData.length > 0 ? (
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2">Nama</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Umur</th>
                      </tr>
                    </thead>
                    <tbody>
                      {UsersData.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="p-2">{user.nama}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">{user.umur}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">Belum ada data user.</p>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">Data Pengunjung</h2>
                {pengunjungData.length > 0 ? (
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2">Nama</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Umur</th>
                        <th className="p-2">Tiket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pengunjungData.map((pengunjung) => (
                        <tr key={pengunjung.id} className="border-t">
                          <td className="p-2">{pengunjung.nama}</td>
                          <td className="p-2">{pengunjung.email}</td>
                          <td className="p-2">{pengunjung.umur}</td>
                          <td className="p-2">{pengunjung.tiket}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">Belum ada pengunjung.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
