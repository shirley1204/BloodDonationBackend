const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();
const { validations, UserAuth } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookies = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const xlsx = require("xlsx");
const path = require("path");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const List = require("./models/List")

require("dotenv").config();
dayjs.extend(customParseFormat);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("Database connection established successfully.");
    app.listen(PORT, () => {
      console.log("server is created1");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json()); //json niddleware
app.use(cookies()); //cookie middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blood-donation-admin-frontend.vercel.app"
    ],
    credentials: true
  })
);

const AuthRouter = require("./Routers/AuthRouter");
const Profilerouter = require("./Routers/ProfileRouter");
const DonorListRouter = require("./Routers/DonorListRouter");
const UserRouter = require("./Routers/UserRouter")

app.use("/", AuthRouter);
app.use("/", Profilerouter);
app.use("/" ,DonorListRouter);
app.use("/" ,UserRouter);

// const convertExcelDate = (value) => {
//   if (!value) return null;
//   if (value instanceof Date) return value;
//   if (typeof value === "number") {
//     return new Date((value - 25569) * 86400 * 1000);
//   }
//   const parsed = new Date(value);
//   return isNaN(parsed.getTime()) ? null : parsed;
// };

// const extractAge = (value) => {
//   if (!value) return null;
//   if (typeof value === "number") return value;
//   const match = String(value).match(/\d+/);
//   return match ? Number(match[0]) : null;
// };

// app.get("/addList", async (req, res) => {
//   try {
//     const filePath = path.join(__dirname, "data.xlsx");

//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     let data = xlsx.utils.sheet_to_json(sheet);

//     data = data.map((item) => ({
//       ...item,
//       age: extractAge(item?.age),
//       dob: convertExcelDate(item?.dob),
//     }));
//     await List.insertMany(data);
//     return res.status(200).json({
//       message: "Excel data inserted successfully",
//       totalInserted: data.length,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Error inserting data",
//       error: error.message,
//     });
//   }
// });
