import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/utils.js";
import axios from "../api/AxiosInstance.js";
import useAuth from "../auth/UseAuth.js";
import { useNavigate } from "react-router-dom";

function KonserApp() {
  const { accessToken, refreshAccessToken, logout} = useAuth();
  const [konserList, setKonserList] = useState([]);
  const navigate = useNavigate();

  const fetchKonser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/konser`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setKonserList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching konser:", error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchKonser();
    }
  }, [accessToken]);

  const handleCardClick = (konser) => {
    navigate(`/konser/${konser.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={logout}
          >
            Logout
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center">Daftar Konser</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {konserList.length > 0 ? (
            konserList.map((konser) => (
              <div
                key={konser.id}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center cursor-pointer hover:shadow-2xl transition"
                onClick={() => handleCardClick(konser)}
              >
                {konser.poster && (
                  <img
                    src={konser.poster}
                    alt={konser.nama}
                    className="mb-4 w-full h-48 object-cover rounded"
                  />
                )}
                <h2 className="text-xl font-bold mb-2 text-center">
                  {konser.nama}
                </h2>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">
              Belum ada konser tersedia.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default KonserApp;
