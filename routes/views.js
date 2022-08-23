
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const router = Router();
const bcrypt = require("bcrypt");


const {
    newSkater,
    getSkaters,
    getSkater,
    updateSkater,
    deleteSkater,
    setSkaterStatus,
    getUsuarioByEmail,
} = require("../consultas");

router.get("/", async (req, res) => {
    try {
        const skaters = await getSkaters()
        res.render("Home", { skaters });
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

router.get("/registro", (req, res) => {
    res.render("Registro");
});

router.get("/perfil", (req, res) => {
    const { token } = req.query
    jwt.verify(token, process.env.SECRET_KEY, (err, skater) => {
        if (err) {
            res.status(500).send({
                error: `Algo salió mal...`,
                message: err.message,
                code: 500
            })
        } else {
            res.render("Perfil", { skater });
        }
    })
});

router.get("/login", (req, res) => {
    res.render("Login");
});

router.post("/login", async (req, res) => {

    const { email, password } = req.body
    let user = await getUsuarioByEmail(email);

    if (!user) {
        return res.status(404).send({
            error: "Este usuario no está registrado en la base de datos",
            code: 404,
        });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword === false) {
        return res.status(401).send({ error: "Contraseña Inválida", code: 401 });
    }
    if (!user.estado) {
        return res.status(401).send({
            error: "El usuario no está hábilitado",
            code: 401,
        });
    }
    try {
        const token = jwt.sign(user, process.env.SECRET_KEY,);
        res.status(200).send(token)
    }
    catch (e) {
        console.log(e)
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    }

});

router.get("/Admin", async (req, res) => {
    try {
        const skaters = await getSkaters();
        res.render("Admin", { skaters });
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

module.exports = router;