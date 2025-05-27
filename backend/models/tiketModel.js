import { Sequelize } from "sequelize";
import db from "../config/database.js";

const Tiket = db.define(
  "tiket",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: Sequelize.STRING,
    tanggal: Sequelize.STRING,
    harga: Sequelize.INTEGER,
    quota: Sequelize.INTEGER,
  },
  {
    freezeTableName: true,
  }
);

db.sync().then(() => console.log("Database synced"));

export default Tiket;
