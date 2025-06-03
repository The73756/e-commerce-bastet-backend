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
const {User, Order, Product} = require("./models/models");
const {compare} = require("bcrypt");

const app = express();
app.use(formidableMiddleware());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use("/api", router);

app.get("/", (req, res) => {
  res.status(200).json({message: "Working"});
});

app.use(errorHandler);

const adminJs = new AdminJS({
  databases: [db],
  rootPath: '/admin',
  dashboard: {
    handler: async () => {
      return {
        usersCount: await User.count(),
        ordersCount: await Order.count(),
        productsCount: await Product.count()
      };
    },
    component: AdminJS.bundle("./components/dashboard.js"),
  },
  branding: {
    companyName: 'Bastet Admin Panel',
    logo: '/logo.svg',
  }
})

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    const user = await User.findOne({email})
    if (user) {
      const matched = await compare(password, user.password)
      if (matched && user.role === 'ADMIN') {
        return user
      }
    }
    return false
  },
  cookiePassword: '123',
})

// const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
//   authenticate: async (email, password) => {
//     const user = await User.findOne({ email })
//     if (user) {
//       const matched = await bcrypt.compare(password, user.encryptedPassword)
//       if (matched) {
//         return user
//       }
//     }
//     return false
//   },
//   cookiePassword: 'some-secret-password-used-to-secure-cookie',
// })

app.use(adminJs.options.rootPath, adminRouter)

app.listen(PORT, () => console.log(`AdminJS is under localhost:${PORT}/admin`))
