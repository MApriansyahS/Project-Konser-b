import Pengunjung from "../models/pengunjungModel.js";

//GET PENGUNJUNG
export const getPengunjung = async(req,res) =>{
    try {
        const pengunjungs = await Pengunjung.findAll();
        res.status(200).json({
            status: "Success",
            message: "Pengunjung Retrieved",
            data: pengunjungs,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error...",
            message: error.message,
        });
    }
}

//GET PENGUNJUNG BY ID
export const getPengunjungById = async(req,res) =>{
    try {
        const pengunjung = await Pengunjung.findOne({ where:{id: req.params.id} });
        if (!pengunjung) {
            const error = new Error("Pengunjung tidak ditemukan !");
            error.statusCode = 400;
            throw error;
          }
          res.status(200).json({
            status: "Success",
            message: "Pengunjung Retrieved",
            data: pengunjung,
          });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error...",
            message: error.message,
        });
    }
}

//ADD PENGUNJUNG
export const addPengunjung = async(req,res) => {
    try {
        const {nama, umur, email} = req.body;
        if (!nama || !umur || !email) {
            const msg = `${
            !nama ? "Nama" : !umur ? "Umur" : "Email"
            } field cannot be empty !`;
            const error = new Error(msg);
            error.statusCode = 401;
            throw error;
        }
        await Pengunjung.create({
        nama: nama,
        umur: umur,
        email: email,
        });
        res.status(201).json({
        status: "Success",
        message: "Pengunjung Added",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

//UPDATE PENGUNJUNG
export const updatePengunjung = async(req,res) => {
    try {
        const {nama, umur, email} = req.body;
        const ifPengunjungExist = await Pengunjung.findOne({ where: { id: req.params.id } });
        if (!nama || !umur || !email) {
            const msg = `${
            !nama ? "Nama" : !umur ? "umur" : "email"
            } field cannot be empty !`;
            const error = new Error(msg);
            error.statusCode = 401;
            throw error;
        }
        if (!ifPengunjungExist) {
            const error = new Error("Pengunjung not found !");
            error.statusCode = 400;
            throw error;
          }
          let updatedData = {nama,umur,email};
      
          await Pengunjung.update(updatedData, {
            where: { id: req.params.id },
          });
      
          res.status(200).json({
            status: "Success",
            message: "Pengunjung Updated",
          });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}

//DELETE PENGUNJUNG
export const deletePengunjung = async(req,res) => {
    try {
        const ifPengunjungExist = await Pengunjung.findOne({ where: { id: req.params.id } });
        if (!ifPengunjungExist) {
            const error = new Error("Pengunjung not found !");
            error.statusCode = 400;
            throw error;
          }
      
          await Pengunjung.destroy({ where: { id: req.params.id } });
          res.status(200).json({
            status: "Success",
            message: "Pengunjung Deleted",
          });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            status: "Error",
            message: error.message,
        });
    }
}