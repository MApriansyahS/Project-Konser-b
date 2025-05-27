import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/AxiosInstance.js";
import { BASE_URL } from "../utils/utils.js";
import useAuth from "../auth/UseAuth.js";

function KonserDetail() {
  const { id } = useParams();
  const { accessToken, refreshAccessToken, logout} = useAuth();
  const [konser, setKonser] = useState(null);
  const [tiket, setTiket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [umur, setUmur] = useState(localStorage.getItem("umur") || "");
  const [nama, setNama] = useState(localStorage.getItem("nama") || "");
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
      
        const res = await axios.get(
        `${BASE_URL}/users/${email}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
    );    
        const userData = res.data.data;
        setNama(userData.nama);
        setUmur(userData.umur);
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
      alert("Order berhasil! Data konser dan tiket akan di-refresh.");

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
      if (
        error.response?.data?.message === "Anda sudah memesan tiket ini !"
      ) {
        alert("Anda sudah membeli tiket konser ini!");
      } else {
        alert("Terjadi kesalahan saat order tiket.");
      }
      console.error("Error order/refresh konser/tiket detail:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!konser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-red-500">Konser tidak ditemukan.</div>
      </div>
    );
  }

  return (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{
      backgroundImage: `url("https://storage.googleapis.com/project-storage-konser/images/konser.jpg")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
      <div className="absolute top-4 right-8">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          onClick={async () => {
            await logout();
            if (konser && tiket) {
              try {
                const userStr = localStorage.getItem("user");
                let user = null;
                if (userStr) {
                  user = JSON.parse(userStr);
                }
                if (!user) {
                  user = { nama: "", email: "", umur: "" };
                }
                await axios.post(`${BASE_URL}/pengunjung`, {
                  nama: user.nama,
                  email: user.email,
                  umur: user.umur,
                  tiket: konser.nama,
                });
              } catch (err) {
                console.error("Gagal copy user ke pengunjung:", err);
              }
            }
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full flex flex-col items-center">
        {konser.poster && (
          <img
            src={konser.poster}
            alt={konser.nama}
            style={{
              width: '300px',
              height: '600px',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
        )}
        <h1 className="text-3xl font-bold mb-4 text-center">{konser.nama}</h1>
        <div className="mb-4 text-gray-700 w-full">
          <p>
            <span className="font-semibold">Tanggal:</span> {konser.tanggal}
          </p>
          <p>
            <span className="font-semibold">Lokasi:</span> {konser.lokasi}
          </p>
          <p>
            <span className="font-semibold">Bintang Tamu:</span> {konser.bintangtamu}
          </p>
          <p>
            <span className="font-semibold">Harga Tiket:</span> {tiket ? `Rp${tiket.harga}` : '-'}
          </p>
          <p>
            <span className="font-semibold">Quota:</span> {tiket ? tiket.quota : '-'}
          </p>
        </div>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
          onClick={handleOrder}
        >
          Order
        </button>
        <button
          className="w-full bg-gray-300 text-gray-800 p-2 rounded mt-2 hover:bg-gray-400"
          onClick={() => navigate(-1)}
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default KonserDetail;
