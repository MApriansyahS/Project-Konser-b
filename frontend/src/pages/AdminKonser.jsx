import { useState, useEffect } from "react";
import axios from "../api/AxiosInstance";
import { BASE_URL } from "../utils/utils.js";
import { Link } from "react-router-dom";
import useAuth from "../auth/UseAuth";

function AdminKonser() {
  const { accessToken, refreshAccessToken, logout } = useAuth();
  const [konserList, setKonserList] = useState([]);
  const [newKonser, setNewKonser] = useState({
    nama: "",
    poster: "",
    tanggal: "",
    lokasi: "",
    bintangtamu: "",
    harga: "",
    quota: "",
  });

  useEffect(() => {
    if (accessToken) {
      fetchKonser();
    }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewKonser((prev) => ({
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
      await axios.post(`${BASE_URL}/konser`, newKonser, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNewKonser({
        nama: "",
        poster: "",
        tanggal: "",
        lokasi: "",
        bintangtamu: "",
        harga: "",
        quota: "",
      });
      fetchKonser();
    } catch (error) {
      console.error("Error adding konser:", error);
      alert(error.response?.data?.message || "Gagal menambah konser");
    }
  };

  return (
    <>
      {/* Navbar Bulma */}
      <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
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
          <h2 className="title is-4">Tambah Konser Baru</h2>
          <form onSubmit={handleAddKonser}>
            <div className="columns is-multiline">
              <div className="column is-half">
                <label className="label">Nama Konser</label>
                <div className="control">
                  <input
                    type="text"
                    name="nama"
                    value={newKonser.nama}
                    onChange={handleInputChange}
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
                    value={newKonser.poster}
                    onChange={handleInputChange}
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
                    value={newKonser.tanggal}
                    onChange={handleInputChange}
                    className="input"
                    required
                    placeholder="Tanggal Konser"
                  />
                </div>
              </div>

              <div className="column is-half">
                <label className="label">Lokasi</label>
                <div className="control">
                  <input
                    type="text"
                    name="lokasi"
                    value={newKonser.lokasi}
                    onChange={handleInputChange}
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
                    value={newKonser.bintangtamu}
                    onChange={handleInputChange}
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
                    value={newKonser.harga}
                    onChange={handleInputChange}
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
                    value={newKonser.quota}
                    onChange={handleInputChange}
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
                <button type="submit" className="button is-primary is-fullwidth">
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
                  <th>Nama Konser</th>
                  <th>Tanggal</th>
                  <th>Poster</th>
                  <th>Lokasi</th>
                  <th>Bintang Tamu</th>
                </tr>
              </thead>
              <tbody>
                {konserList.map((konser) => (
                  <tr key={konser.nama}>
                    <td>{konser.nama}</td>
                    <td>{konser.tanggal}</td>
                    <td>
                      <img
                        src={konser.poster}
                        alt={`Poster ${konser.nama}`}
                        style={{ maxWidth: "100px", height: "auto" }}
                      />
                    </td>
                    <td>{konser.lokasi}</td>
                    <td>{konser.bintangtamu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminKonser;
