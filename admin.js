
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");
const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSSequelize = require("@adminjs/sequelize");
const formidableMiddleware = require('express-formidable');

AdminJS.registerAdapter(AdminJSSequelize)
const PORT = process.env.ADMIN_PORT || 3001;

const db = require('./db');

const app = express();
app.use(formidableMiddleware());
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use("/api", router);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Working" });
});

app.use(errorHandler);

const adminJs = new AdminJS({
  databases: [db],
  rootPath: '/admin',
})

const adminRouter = AdminJSExpress.buildRouter(adminJs)

app.use(adminJs.options.rootPath, adminRouter)

app.listen(PORT, () => console.log(`AdminJS is under localhost:${PORT}/admin`))
