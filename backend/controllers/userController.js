import { Error } from "sequelize";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//GET USER
export const getUser = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: "Success",
      message: "Users Retrieved",
      data: users,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error...",
      message: error.message,
    });
  }
};

//GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!user) {
      const error = new Error("User tidak ditemukan !");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({
      status: "Success",
      message: "User Retrieved",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error...",
      message: error.message,
    });
  }
};

//GET USER BY EMAIL
export async function getUserByEmail(req, res) {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) {
      const error = new Error("User tidak ditemukan !");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({
      status: "Success",
      message: "User Retrieved",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

//ADD USER
export const addUser = async (req, res) => {
  try {
    const { nama, email, umur, pass } = req.body;
    if (!nama || !email || !umur || !pass) {
      const msg = `${
        !nama ? "Nama" : !email ? "Email" : !umur ? "Umur" : "pass"
      } field cannot be empty !`;
      const error = new Error(msg);
      error.statusCode = 401;
      throw error;
    }

    const existingUser = await User.findOne({
      where: { email: email },
    });

    if (existingUser) {
      const error = new Error("Email Sudah Terdaftar !");
      error.statusCode = 400;
      throw error;
    }

    const encryptedpass = await bcrypt.hash(pass, 5);
    await User.create({
      nama: nama,
      email: email,
      umur: umur,
      pass: encryptedpass,
    });
    res.status(201).json({
      status: "Success",
      message: "User Added",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { nama, email, pass } = req.body;
    const ifUserExist = await User.findOne({ where: { id: req.params.id } });
    if (!nama || !email || !umur || !pass) {
      const msg = `${
        !nama ? "Nama" : !email ? "Email" : !umur ? "Umur" : "pass"
      } field cannot be empty !`;
      const error = new Error(msg);
      error.statusCode = 401;
      throw error;
    }
    if (!ifUserExist) {
      const error = new Error("User not found !");
      error.statusCode = 400;
      throw error;
    }

    const encryptedpass = await bcrypt.hash(pass, 5);
    let updatedData = { nama, email, encryptedpass };

    await User.update(updatedData, {
      where: { id: req.params.id },
    });

    res.status(200).json({
      status: "Success",
      message: "User Updated",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const ifUserExist = await User.findOne({ where: { id: req.params.id } });
    if (!ifUserExist) {
      const error = new Error("User not found !");
      error.statusCode = 400;
      throw error;
    }

    await User.destroy({ where: { id: req.params.id } });
    res.status(200).json({
      status: "Success",
      message: "User Deleted",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// LOGIN HANDLER
export async function loginHandler(req, res) {
  try {
    const { nama, email, pass } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      const userPlain = user.toJSON();
      const { pass: _, refresh_token: __, ...safeUserData } = userPlain;

      const decryptPassword = await bcrypt.compare(pass, user.pass);
      if (decryptPassword) {
        const accessToken = jwt.sign(
          safeUserData,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        const refreshToken = jwt.sign(
          safeUserData,
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        await User.update(
          { refresh_token: refreshToken },
          {
            where: {
              id: user.id,
            },
          }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "Strict",
          maxAge: 24 * 60 * 60 * 1000,
          secure: true,
        });
        res.status(200).json({
          status: "Succes",
          message: "Login Berhasil",
          safeUserData,
          accessToken,
        });
      } else {
        res.status(400).json({
          status: "Failed",
          message: "Password atau email salah",
        });
      }
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Password atau email salah",
      });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
    });
  }
}

// LOGOUT
export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await User.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user.refresh_token) return res.sendStatus(204);
  const userId = user.id;
  await User.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
}
