import Pengunjung from "../models/pengunjungModel.js";
import Tiket from "../models/tiketModel.js";

// ORDER TICKET
export async function orderTicket(req, res) {
  try {
    const { nama, umur, email } = req.body;

    if (!nama || !umur || !email) {
      const msg = `${
        !nama ? "Nama" : !umur ? "Umur" : "Email"
      } field cannot be empty !`;
      const error = new Error(msg);
      error.statusCode = 401;
      throw error;
    }

    const tiket = await Tiket.findOne({
      where: { id: req.params.id },
    });

    if (!tiket) {
      const error = new Error("Tiket tidak ditemukan !");
      error.statusCode = 400;
      throw error;
    }

    if (umur <= 16) {
      const error = new Error("Umur tidak mencukupi !");
      error.statusCode = 400;
      throw error;
    }

    if (tiket.quota < 1) {
      const error = new Error("Quota tiket tidak mencukupi !");
      error.statusCode = 400;
      throw error;
    }

    const updatedQuota = tiket.quota - 1;

    await Tiket.update(
      { quota: updatedQuota },
      {
        where: { id: req.params.id },
      }
    );
    const namaTiket = tiket.nama;
    await Pengunjung.create({
      nama: nama,
      umur: umur,
      email: email,
      tiket: namaTiket,
    });
    res.status(200).json({
      status: "Success",
      message: "Order Created",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}
