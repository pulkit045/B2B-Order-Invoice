const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
require("dotenv").config();
require("./helpers/init_mongodb");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const html = fs.readFileSync("template.html", "utf8");
const path = require("path");

const { verifyAccessToken } = require("./helpers/jwt_helper");
const AuthRoute = require("./Routes/Auth.route");
const OrderRoute = require("./Routes/Order.route");
const pdfCalculation = require('./helpers/pdf_calculation')

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./build")));

// app.get(/^(?!\/api).+/, (req,res)=>{
//   res.sendFile(path.join(__dirname, './build/index.html'));
// })

app.use("/api/auth", AuthRoute);
app.use("/api/orders", OrderRoute);

app.get(async (req, res, next) => {
  next(createError.NotFound());
});

app.post("/api/orders/invoice",verifyAccessToken, async (req, res, next) => {
  try {
    const { _id: orderId, itemCount } = req.body;
    const { items, subTotal, cgstTotal, sgstTotal, total, totalInWords} = pdfCalculation(itemCount)
    const options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
    };
    const document = {
      html: html,
      data: {
        items, subTotal, cgstTotal, sgstTotal, total, totalInWords
      },
      path: `${path.join(__dirname,'./invoice.pdf')}`,
      type: "",
    };

    await pdf.create(document, options);
    const option = {
      root: path.join(__dirname),
    };
    const fileName = `${path.join(__dirname,'./invoice.pdf')}`;
    res.sendFile(fileName, option, function (err) {
      if (err) {
        next(err);
      } else {
        console.log("Sent:", fileName);
      }
    });
  }
  catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
