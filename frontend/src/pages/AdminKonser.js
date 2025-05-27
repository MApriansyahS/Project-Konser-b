import { useState, useEffect } from "react";
import axios from "../api/AxiosInstance";
import { BASE_URL } from "../utils/utils.js";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../auth/UseAuth";

function AdminKonser() {
  const { accessToken, logout } = useAuth();
  const [konserList, setKonserList] = useState([]);
  const [editingKonser, setEditingKonser] = useState(null);
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [poster, setPoster] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [bintangtamu, setBintang] = useState("");
  const [harga, setHarga] = useState();
  const [quota, setQuota] = useState();

  useEffect(() => {
    if (accessToken) fetchKonser();
  }, [accessToken]);

  const fetchKonser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/konser`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setKonserList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching konser:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleEditKonser = (id) => {
    const konser = konserList.find((t) => t.id === id);
    if (konser) {
      setEditingKonser({
        id: konser.id,
        nama: konser.nama,
        poster: konser.poster,
        bintangtamu: konser.bintangtamu,
        tanggal: konser.tanggal,
        lokasi: konser.lokasi,
      });
    }
  };
  const handleUpdateKonser = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      alert("Anda harus login sebagai admin.");
      return;
    }
    try {
      await axios.patch(
        `${BASE_URL}/konser/${editingKonser.id}`,
        {
          id: editingKonser.id,
          nama: editingKonser.nama,
          poster: editingKonser.poster,
          bintangtamu: editingKonser.bintangtamu,
          tanggal: editingKonser.tanggal,
          lokasi: editingKonser.lokasi,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setEditingKonser(null);
      fetchKonser();
    } catch (error) {
      console.error("Error updating tiket:", error);
      alert(error.response?.data?.message || "Gagal mengupdate tiket");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingKonser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddKonser = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      alert("Anda harus login sebagai admin.");
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/konser`,
        {
          nama: nama,
          poster: poster,
          tanggal: tanggal,
          lokasi: lokasi,
          bintangtamu: bintangtamu,
          harga: harga,
          quota: quota,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      fetchKonser();
    } catch (error) {
      console.error("Error adding konser:", error);
      alert(error.response?.data?.message || "Gagal menambah konser");
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
          <Link to="" className="navbar-item">
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

      <section className="section" style={{ flexGrow: 1 }}>
        <div className="container box">
          <h2 className="title is-4">Tambah Konser Baru</h2>
          <form onSubmit={handleAddKonser}>
            <div className="columns is-multiline">
              <div className="column is-half">
                <label className="label">Nama Konser</label>
                <div className="control">
                  <input
                    type="text"
                    name="nama"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="input"
                    required
                    placeholder="Nama Konser"
                  />
                </div>
              </div>

              <div className="column is-half">
                <label className="label">Poster</label>
                <div className="control">
                  <input
                    type="text"
                    name="poster"
                    value={poster}
                    onChange={(e) => setPoster(e.target.value)}
                    className="input"
                    required
                    placeholder="Link Poster"
                  />
                </div>
              </div>

              <div className="column is-half">
                <label className="label">Tanggal</label>
                <div className="control">
                  <input
                    type="date"
                    name="tanggal"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="column is-half">
                <label className="label">Lokasi</label>
                <div className="control">
                  <input
                    type="text"
                    name="lokasi"
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    className="input"
                    required
                    placeholder="Lokasi Konser"
                  />
                </div>
              </div>

              <div className="column is-half">
                <label className="label">Bintang Tamu</label>
                <div className="control">
                  <input
                    type="text"
                    name="bintangtamu"
                    value={bintangtamu}
                    onChange={(e) => setBintang(e.target.value)}
                    className="input"
                    required
                    placeholder="Bintang Tamu"
                  />
                </div>
              </div>

              <div className="column is-half">
                <label className="label">Harga Konser</label>
                <div className="control">
                  <input
                    type="number"
                    name="harga"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    className="input"
                    required
                    placeholder="Harga Konser"
                    min="0"
                  />
                </div>
              </div>

              <div className="column is-half">
                <label className="label">Quota Konser</label>
                <div className="control">
                  <input
                    type="number"
                    name="quota"
                    value={quota}
                    onChange={(e) => setQuota(e.target.value)}
                    className="input"
                    required
                    placeholder="Quota Konser"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="field mt-4">
              <div className="control">
                <button
                  type="submit"
                  className="button is-primary is-fullwidth"
                >
                  Tambah Konser
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container box">
          <h2 className="title is-4">Daftar Konser</h2>
          <div className="table-container">
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Nama</th>
                  <th>Bintang Tamu</th>
                  <th>Tanggal</th>
                  <th>Lokasi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {konserList.map((konser) => (
                  <tr key={konser.nama}>
                    <td>
                      <img
                        src={konser.poster}
                        alt={`Poster ${konser.nama}`}
                        style={{ maxWidth: "100px", height: "auto" }}
                      />
                    </td>
                    <td>{konser.nama}</td>
                    <td>{konser.bintangtamu}</td>
                    <td>{konser.tanggal}</td>
                    <td>{konser.lokasi}</td>
                    <td>
                      <button
                        onClick={() => handleEditKonser(konser.id)}
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

      {editingKonser && (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => setEditingKonser(null)}
          ></div>
          <div className="modal-card" style={{ width: "400px" }}>
            <header className="modal-card-head">
              <p className="modal-card-title">Edit Konser</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => setEditingKonser(null)}
              ></button>
            </header>
            <section className="modal-card-body">
              <form onSubmit={handleUpdateKonser}>
                <div className="field">
                  <label className="label">Nama</label>
                  <div className="control">
                    <input
                      type="text"
                      name="nama"
                      value={editingKonser.nama}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Poster</label>
                  <div className="control">
                    <input
                      type="text"
                      name="poster"
                      value={editingKonser.poster}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Bintang Tamu</label>
                  <div className="control">
                    <input
                      type="text"
                      name="bintangtamu"
                      value={editingKonser.bintangtamu}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Tanggal</label>
                  <div className="control">
                    <input
                      type="date"
                      name="tanggal"
                      value={editingKonser.tanggal}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Lokasi</label>
                  <div className="control">
                    <input
                      type="text"
                      name="lokasi"
                      value={editingKonser.lokasi}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                </div>
                <div className="field is-grouped is-justify-content-flex-end mt-4">
                  <button
                    type="button"
                    className="button"
                    onClick={() => setEditingKonser(null)}
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

export default AdminKonser;
