const express = require("express");
const PORT = 3000;
const exphbs = require("express-handlebars");
const path = require("path");
const { readJSON, writeJSON } = require("./utils/fileUtils");

const app = express();

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Configuración de Handlebars
app.engine("handlebars", exphbs.engine({ extname: ".handlebars" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta basica de inicio
app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Bienvenido a la librería en línea" });
});

// Ruta listar productos
const productosPath = path.join(__dirname, "productos.json");

app.get("/productos", async (req, res, next) => {
    try {
        const productos = await readJSON(productosPath);

        res.render("producto", {
            titulo: "Listado de productos",
            productos
        });
    } catch (err) {
        next(err);
    }
});
app.get("/agregar-producto", (req, res) => {
    res.render("formulario", { titulo: "Agregar nuevo producto" });
});
// Ruta agregar producto
app.post("/agregar-producto", async (req, res, next) => {

    try {
        const { nombre, descripcion = "", precio } = req.body;

        if (!nombre || !precio) {
            return res.status(400).send("Nombre y precio son requeridos.");
        }

        const productos = await readJSON(productosPath);

        const nuevoProducto = {
            id: productos.length ? productos[productos.length - 1].id + 1 : 1,
            nombre: String(nombre),
            descripcion: String(descripcion),
            precio: Number(precio)
        };

        productos.push(nuevoProducto);

        await writeJSON(productosPath, productos);

        res.redirect("/productos");
    } catch (err) {
        next(err);
    }
});
//manejo de errores
// 404
app.use((req, res) => {
    res.status(404).send("404 - No encontrado");
});

// 500
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Error interno del servidor.");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
