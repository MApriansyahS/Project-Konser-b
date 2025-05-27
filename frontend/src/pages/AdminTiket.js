import { useState, useEffect } from "react";
import axios from "../api/AxiosInstance";
import { BASE_URL } from "../utils/utils.js";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../auth/UseAuth";

function AdminTiket() {
  const { accessToken, logout } = useAuth();
  const [tiketList, setTiketList] = useState([]);
  const [editingTiket, setEditingTiket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) fetchTiket();
  }, [accessToken]);

  const fetchTiket = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tiket`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTiketList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tiket:", error);
    }
  };

  const handleEditTiket = (id) => {
    const tiket = tiketList.find((t) => t.id === id);
    if (tiket) {
      setEditingTiket({
        id: tiket.id,
        harga: tiket.harga,
        quota: tiket.quota,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTiket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleUpdateTiket = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      alert("Anda harus login sebagai admin.");
      return;
    }
    try {
      await axios.patch(
        `${BASE_URL}/tiket/${editingTiket.id}`,
        {
          harga: editingTiket.harga,
          quota: editingTiket.quota,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setEditingTiket(null);
      fetchTiket();
    } catch (error) {
      console.error("Error updating tiket:", error);
      alert(error.response?.data?.message || "Gagal mengupdate tiket");
    }
  };

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
          <Link to="/admin-dashboard" className="navbar-item">
            User & Pengguna
          </Link>
          <Link to="/AdminKonser" className="navbar-item">
            Konser
          </Link>
          <Link to="" className="navbar-item">
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

      <section className="section" style={{ flexGrow: 1 }}>
        <div className="container box">
          <h2 className="title is-4">Daftar Tiket</h2>
          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Nama Konser</th>
                  <th>Tanggal</th>
                  <th>Harga</th>
                  <th>Quota</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tiketList.map((tiket) => (
                  <tr key={tiket.id}>
                    <td>{tiket.nama}</td>
                    <td>{tiket.tanggal}</td>
                    <td>{tiket.harga}</td>
                    <td>{tiket.quota}</td>
                    <td>
                      <button
                        onClick={() => handleEditTiket(tiket.id)}
                        className="button is-warning is-small"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {editingTiket && (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => setEditingTiket(null)}
          ></div>
          <div className="modal-card" style={{ width: "400px" }}>
            <header className="modal-card-head">
              <p className="modal-card-title">Edit Tiket</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => setEditingTiket(null)}
              ></button>
            </header>
            <section className="modal-card-body">
              <form onSubmit={handleUpdateTiket}>
                <div className="field">
                  <label className="label">Harga</label>
                  <div className="control">
                    <input
                      type="number"
                      name="harga"
                      value={editingTiket.harga}
                      onChange={handleInputChange}
                      className="input"
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Quota</label>
                  <div className="control">
                    <input
                      type="number"
                      name="quota"
                      value={editingTiket.quota}
                      onChange={handleInputChange}
                      className="input"
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="field is-grouped is-justify-content-flex-end mt-4">
                  <button
                    type="button"
                    className="button"
                    onClick={() => setEditingTiket(null)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="button is-primary">
                    Simpan
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTiket;
