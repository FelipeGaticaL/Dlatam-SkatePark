const { Router } = require("express");
const path = require("path");
const apiRouter = Router();
const bcrypt = require("bcrypt");

const {
    newSkater,
    getSkaters,
    getSkater,
    updateSkater,
    deleteSkater,
    setSkaterStatus,
} = require("../consultas");


apiRouter.get("/skaters", async (req, res) => {

    try {
        const skaters = await getSkaters()
        res.status(200).send(skaters);
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

apiRouter.post("/skaters", async (req, res) => {

    if (req.body.password != req.body.password2) {
        return res.status(401).send({ error: "Contraseña no coinciden", code: 401 });
    }
    let pass = await bcrypt.hash(req.body.password, 10);
    req.body.password = pass;
    const remove = req.body;
    let { password2, ...skater } = remove
    if (req.files == null) {
        return res.status(400).send("No se encontro ningun archivo en la consulta");
    }
    const { files } = req
    const { foto } = files;
    const { name } = foto;
    const pathPhoto = `/uploads/${name}`
    foto.mv(path.join(__dirname, "..", `/public${pathPhoto}`), async (err) => {
        try {
            if (err) throw err
            skater.foto = pathPhoto
            await newSkater(skater);
            res.status(201).redirect("/login");
        } catch (e) {
            console.log(e)

            res.status(500).send({
                error: `Algo salió mal... ${e}`,
                code: 500
            })
        };

    });
})

apiRouter.put("/skaters", async (req, res) => {

    if (req.body.password != req.body.repassword) {
        return res.status(401).send({ error: "Contraseña no coinciden", code: 401 });
    }
    let pass2 = await bcrypt.hash(req.body.password, 10);
    req.body.password = pass2;
    const remove2 = req.body;
    let { repassword, ...skater } = remove2

    try {
        await updateSkater(skater);
        res.status(200).send("Datos actualizados con éxito");
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

apiRouter.put("/skaters/status/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        await setSkaterStatus(id, estado);
        res.status(200).send("Estatus de skater cambiado con éxito");
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});

apiRouter.delete("/skaters/:id", async (req, res) => {
    const { id } = req.params
    try {
        await deleteSkater(id)
        res.status(200).send();
    } catch (e) {
        res.status(500).send({
            error: `Algo salió mal... ${e}`,
            code: 500
        })
    };
});




module.exports = apiRouter;