import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../auth/UseAuth";
import axios from "../api/AxiosInstance";
import { BASE_URL } from "../utils/utils.js";

const AdminDashboard = () => {
  const { accessToken, refreshAccessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState("user");
  const [UsersData, setUsersData] = useState([]);
  const [pengunjungData, setPengunjungData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = UsersData.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPengunjung = pengunjungData.filter((pengunjung) =>
    pengunjung.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsersData();
    fetchPengunjungData();
  }, [accessToken]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        backgroundImage:
          'url("https://storage.googleapis.com/project-storage-konser/images/konser.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <nav
        className="navbar is-dark-grey"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <span className="navbar-item has-text-weight-bold is-size-5">
            Admin Dashboard
          </span>
        </div>

        <div className="navbar-start">
          <Link to="" className="navbar-item">
            User & Pengguna
          </Link>
          <Link to="/AdminKonser" className="navbar-item">
            Konser
          </Link>
          <Link to="/AdminTiket" className="navbar-item">
            Tiket
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <button onClick={handleLogout} className="button is-danger">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="section" style={{ flexGrow: 1 }}>
        <div className="container">
          <div className="box">
            <div className="level mb-4">
              <div className="level-left">
                <div className="buttons has-addons">
                  <button
                    onClick={() => setSelectedTable("user")}
                    className={`button ${
                      selectedTable === "user" ? "is-info" : "is-dark"
                    }`}
                  >
                    Tabel User
                  </button>
                  <button
                    onClick={() => setSelectedTable("pengunjung")}
                    className={`button ${
                      selectedTable === "pengunjung" ? "is-info" : "is-dark"
                    }`}
                  >
                    Tabel Pengunjung
                  </button>
                </div>
              </div>
              <div className="level-right">
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <span className="icon is-left">
                      <i className="fas fa-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <table className="table is-striped is-fullwidth is-hoverable">
              <thead>
                {selectedTable === "user" ? (
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Umur</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Umur</th>
                    <th>Tiket</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {selectedTable === "user" ? (
                  filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="has-text-centered has-text-grey"
                      >
                        Tidak ada data user.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.nama}</td>
                        <td>{user.email}</td>
                        <td>{user.umur}</td>
                      </tr>
                    ))
                  )
                ) : filteredPengunjung.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="has-text-centered has-text-grey">
                      Tidak ada data pengunjung.
                    </td>
                  </tr>
                ) : (
                  filteredPengunjung.map((pengunjung) => (
                    <tr key={pengunjung.id}>
                      <td>{pengunjung.nama}</td>
                      <td>{pengunjung.email}</td>
                      <td>{pengunjung.umur}</td>
                      <td>{pengunjung.tiket}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
