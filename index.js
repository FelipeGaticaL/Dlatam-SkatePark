// Importaciones
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Server
app.listen(3000, () => console.log("http://localhost:3000"))

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(
    expressFileUpload({
        limits: 5000000,
        abortOnLimit: true,
        responseOnLimit: "El tamaño de la imagen supera el límite permitido",
        createParentPath: true,
    })
);
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.engine(
    "hbs",
    exphbs({
        extname: '.hbs',
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/main`,
    })
);
app.set("view engine", "hbs");

//Routes
app.use("/", require("./routes/views"));

app.use("/", require("./routes/api"));
