import express from "express";

import {
  createUser,
  generatePassword,
  generateToken,
  getAllUser,
  getUser,
  updateUser,
  userExist,
  deleteUser,
} from "../controllers/userController.js";
import bcrypt from "bcryptjs";
import { adminAuth, auth, validateToken } from "../middleware/auth.js";

import jwt from "jsonwebtoken";

const router = express.Router();

// sign up

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({ message: "Enter all necessary details" });
    } else {
      const isUserExist = await userExist(email);
      if (isUserExist) {
        return res.status(409).send({ message: "user Already exist" });
      } else {
        const newPassword = await generatePassword(password);

        if (newPassword) {
          const user = await createUser(username, email, newPassword, role);

          const token = await generateToken(user._id, user.username, user.role);
          res.cookie("token", token, { maxAge: 100000 * 60, signed: true });

          return res.status(201).send({
            message: "user created successfully",
            data: { userId: user._id, token },
          });
        }
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

// login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = await req.body;

    const user = await userExist(email);

    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);

      if (checkPassword) {
        req.session.regenerate((err) => {
          if (err) {
            return res.status(500).send("Error regenerating session");
          }
        });
        const token = await generateToken(user._id, user.username, user.role);
        const decode = jwt.verify(token, process.env.SECRET_KEY);

        const expiry = new Date(decode.exp * 1000).toLocaleString("en-IN");
        // Set user-specific session data
        req.session.user = { username: user.username };
        res.cookie("token", token, {
          maxAge: 100000 * 60,
        });

        res.cookie("cart", [{ productId: "hgvsdfv", quantity: 5 }]);

        res.cookie(
          "datas",
          [
            {
              message: "Login Successful",
              id: user.id,
              username: user.username,
              role: user.role,
              token,
              expiry,
            },
          ],
          { maxAge: 100000 * 60, signed: true }
        );

        return res.status(200).send({
          message: "Login Successful",
          id: user.id,
          username: user.username,
          role: user.role,
          token,
          expiry,
        });
      } else return res.status(400).send({ message: "Incorrect Credentials" });
    }
    return res.status(400).send({ message: "user does not Exists" });
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

router.get("/getusers", validateToken, adminAuth, async (req, res) => {
  try {
    const allUsers = await getAllUser();
    if (allUsers.length > 0) {
      res.status(201).send({ message: "Users fetched Successfully", allUsers });
    }
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

router.put("/update/:id", validateToken, adminAuth, async (req, res) => {
  try {
    const { id } = await req.params;

    const body = await req.body;

    const user = await getUser(id);
    if (user) {
      const updatedUser = updateUser(id, body[0]);
      return res
        .status(201)
        .send({ message: "User Updated Successfully", updatedUser });
    }
    res.status(400).send({ message: "unable to update" });
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

router.delete("/delete/:id", validateToken, adminAuth, async (req, res) => {
  try {
    const { id } = await req.params;

    const user = await getUser(id);
    if (user) {
      const deletedUser = await deleteUser(id);
      return res
        .status(201)
        .send({ message: `${user.username} deleted Successfully` });
    }
    res.status(401).send({ message: `Unable to Find User` });
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

export const userRoutes = router;
