import { useEffect, useState } from "react";
import useAuth from "../auth/UseAuth.js";
import axios from "../api/AxiosInstance.js";
import { BASE_URL } from "../utils/utils.js";
import { Link, useNavigate } from "react-router-dom";

function ProfilePage() {
  const { accessToken, refreshAccessToken, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [tiketList, setTiketList] = useState([]);
  const [konserMap, setKonserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const emailLocal = localStorage.getItem("email");
        setEmail(emailLocal || "");
        if (!emailLocal) return;
        // Ambil data user yang sedang login
        await axios.get(`${BASE_URL}/users/${emailLocal}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        // Ambil tiket milik user dari tabel pengunjung
        const pengunjungRes = await axios.get(`${BASE_URL}/pengunjung`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const tiketSaya = (pengunjungRes.data.data || []).filter(
          (p) => p.email === emailLocal
        );
        setTiketList(tiketSaya);
        // Ambil semua konser dan buat map nama->data konser
        const konserRes = await axios.get(`${BASE_URL}/konser`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const map = {};
        (konserRes.data.data || []).forEach((k) => {
          map[k.nama] = k;
        });
        setKonserMap(map);
      } catch (error) {
        setTiketList([]);
        setKonserMap({});
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchProfile();
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
        alignItems: "center",
        justifyContent: "center",
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
        <div className="navbar-end">
          <div className="navbar-item">
            <button onClick={handleLogout} className="button is-danger">
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: "400px",
          maxHeight: "90vh",
          overflowY: "auto",
          color: "white",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Profil Saya
        </h2>
        <div style={{ marginBottom: "1rem" }}>
          <strong>Email: </strong>{" "}
          {email || <span style={{ color: "#999" }}>(tidak ditemukan)</span>}
        </div>
        <div>
          <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
            Tiket yang Dimiliki:
          </h3>
          {loading ? (
            <p style={{ color: "#bbb" }}>Loading...</p>
          ) : tiketList.length > 0 ? (
            <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
              {tiketList.map((t, idx) => {
                const konser = konserMap[t.tiket] || {};
                return (
                  <li
                    key={idx}
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    {konser.poster && (
                      <img
                        src={konser.poster}
                        alt={konser.nama}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: "600" }}>
                        {konser.nama || t.tiket}
                      </div>
                      <div style={{ color: "#ccc", fontSize: "0.9rem" }}>
                        {konser.tanggal || "-"}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p style={{ color: "#bbb" }}>Belum ada tiket yang dimiliki.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
