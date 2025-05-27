import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/AxiosInstance.js";
import { BASE_URL } from "../utils/utils.js";
import useAuth from "../auth/UseAuth.js";

function Detail() {
  const { id } = useParams();
  const { accessToken, logout } = useAuth();
  const [konser, setKonser] = useState(null);
  const [tiket, setTiket] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const konserRes = await axios.get(`${BASE_URL}/konser/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setKonser(konserRes.data.data);

        const tiketRes = await axios.get(`${BASE_URL}/tiket`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const tiketMatch = (tiketRes.data.data || []).find(
          (t) => t.nama === konserRes.data.data.nama
        );
        setTiket(tiketMatch || null);
      } catch (error) {
        console.error("Error fetching konser/tiket detail:", error);
        setKonser(null);
        setTiket(null);
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchDetail();
  }, [id, accessToken]);

  const handleOrder = async () => {
    if (!accessToken || !konser || !tiket) return;
    try {
      const email = localStorage.getItem("email");
      const res = await axios.get(`${BASE_URL}/users/${email}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = res.data.data;
      localStorage.setItem("nama", userData.nama);
      localStorage.setItem("umur", userData.umur);

      if (tiket.quota <= 0) {
        alert("Maaf, tiket sudah habis!");
        return;
      }

      await axios.patch(
        `${BASE_URL}/order/${tiket.id}`,
        {
          nama: userData.nama,
          email: email,
          umur: userData.umur,
          tiket: tiket.nama,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Order berhasil!");

      // Refresh konser dan tiket
      const konserRes = await axios.get(`${BASE_URL}/konser/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setKonser(konserRes.data.data);
      const tiketRes = await axios.get(`${BASE_URL}/tiket`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const tiketMatch = (tiketRes.data.data || []).find(
        (t) => t.nama === konserRes.data.data.nama
      );
      setTiket(tiketMatch || null);
    } catch (error) {
      if (error.response?.data?.message === "Anda sudah memesan tiket ini !") {
        alert("Anda sudah membeli tiket konser ini!");
      } else {
        alert("Terjadi kesalahan saat order tiket.");
      }
      console.error("Error order:", error);
    }
  };

  if (loading) {
    return (
      <section className="section has-text-centered">
        <p className="is-size-4 has-text-grey">Loading...</p>
      </section>
    );
  }

  if (!konser) {
    return (
      <section className="section has-text-centered">
        <p className="is-size-4 has-text-danger">Konser tidak ditemukan.</p>
      </section>
    );
  }

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
        flexDirection: "column",
        overflowY: "auto", // agar konten bisa discroll jika terlalu panjang
      }}
    >
      <nav
        className="navbar is-dark-grey"
        role="navigation"
        aria-label="main navigation"
        style={{ width: "100%" }}
      >
        <div className="navbar-brand">
          <span className="navbar-item has-text-weight-bold is-size-5">
            {/* Halo, {userName} ! */}
          </span>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            {/* <button onClick={handleLogout} className="button is-danger">
              Logout
            </button> */}
          </div>
        </div>
      </nav>

      <section className="section" style={{ width: "100%", maxWidth: "600px" }}>
        <div className="container">
          <div className="card">
            <div className="card-image has-text-centered p-4">
              {konser.poster ? (
                <figure
                  className="image is-3by4 mx-auto"
                  style={{ maxWidth: "300px" }}
                >
                  <img
                    src={konser.poster}
                    alt={konser.nama}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </figure>
              ) : (
                <div
                  className="has-background-grey-lighter has-text-grey-light is-flex is-justify-content-center is-align-items-center"
                  style={{ height: "400px", borderRadius: "8px" }}
                >
                  No Poster
                </div>
              )}
            </div>
            <div className="card-content">
              <h1 className="title is-4 has-text-centered">{konser.nama}</h1>
              <div className="content has-text-centered">
                <p>
                  <strong>Tanggal:</strong> {konser.tanggal}
                </p>
                <p>
                  <strong>Lokasi:</strong> {konser.lokasi}
                </p>
                <p>
                  <strong>Bintang Tamu:</strong> {konser.bintangtamu}
                </p>
                <p>
                  <strong>Harga Tiket:</strong>{" "}
                  {tiket ? `Rp${tiket.harga}` : "-"}
                </p>
                <p>
                  <strong>Quota:</strong> {tiket ? tiket.quota : "-"}
                </p>
              </div>
              <div className="buttons mt-4 is-flex is-justify-content-center">
                <button className="button is-primary" onClick={handleOrder}>
                  Order
                </button>
                <button
                  className="button is-light"
                  onClick={() => navigate(-1)}
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Detail;
