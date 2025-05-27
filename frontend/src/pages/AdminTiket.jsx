import { useState, useEffect } from "react";
import axios from "../api/AxiosInstance";
import { BASE_URL } from "../utils/utils.js";
import { Link } from "react-router-dom";
import useAuth from "../auth/UseAuth";

function AdminTiket() {
  const [tiketList, setTiketList] = useState([]);
  const [editingTiket, setEditingTiket] = useState(null);
  const { accessToken, refreshAccessToken, logout} = useAuth();

  useEffect(() => {
    if (accessToken) {
      fetchTiket();
    }
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
    setEditingTiket({
      id,
      harga: tiket.harga,
      quota: tiket.quota,
    });
  };

  const handleUpdateTiket = async () => {
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
    <>
      {/* Navbar Bulma */}
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

      <section className="section">
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

        {/* Modal Edit Tiket */}
        {editingTiket && (
          <div className={`modal is-active`}>
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
                <div className="field">
                  <label className="label">Harga</label>
                  <div className="control">
                    <input
                      type="number"
                      className="input"
                      value={editingTiket.harga}
                      onChange={(e) =>
                        setEditingTiket({ ...editingTiket, harga: e.target.value })
                      }
                      min="0"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Quota</label>
                  <div className="control">
                    <input
                      type="number"
                      className="input"
                      value={editingTiket.quota}
                      onChange={(e) =>
                        setEditingTiket({ ...editingTiket, quota: e.target.value })
                      }
                      min="0"
                    />
                  </div>
                </div>
              </section>
              <footer className="modal-card-foot is-justify-content-flex-end">
                <button
                  className="button"
                  onClick={() => setEditingTiket(null)}
                >
                  Batal
                </button>
                <button className="button is-primary" onClick={handleUpdateTiket}>
                  Simpan
                </button>
              </footer>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AdminTiket;
