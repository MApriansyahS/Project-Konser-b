import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/AxiosInstance.js";
import { BASE_URL } from "../utils/utils.js";
import useAuth from "../auth/UseAuth.js";

const KonserDetail = () => {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [konser, setKonser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/konser/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setKonser(response.data.data);
      } catch (error) {
        console.error("Error fetching konser detail:", error);
        setKonser(null);
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchDetail();
  }, [id, accessToken]);

  const handleOrder = () => {
    // Ganti dengan navigasi ke halaman order atau aksi order tiket
    navigate("/order", { state: { konser } });
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
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full flex flex-col items-center">
        {konser.poster && (
          <img
            src={konser.poster}
            alt={konser.nama}
            style={{
                width: '300px',
                height: '200px',
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
            <span className="font-semibold">Harga Tiket:</span> Rp{konser.harga}
          </p>
          <p>
            <span className="font-semibold">Quota:</span> {konser.quota}
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
