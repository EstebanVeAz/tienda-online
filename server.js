const express = require("express")
const PORT = 3000

const app = express()

//ruta basica 
app.get('/', (req,res) => {
    res.send('Bienvenido a la tienda en linea!!')
})



app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost:${PORT}`)
})