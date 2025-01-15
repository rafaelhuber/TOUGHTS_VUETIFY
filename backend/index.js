const express = require('express')
const cors = require('cors')

const app = express()

//config JSON response
app.use(express.json())

//Solve CORS
app.use(cors({
    origin: ['http://localhost:4000', 'http://localhost:5173'], // Permite múltiplas origens
    methods: ['GET', 'POST', 'DELETE', 'PATCH'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    credentials: true, // Permitir envio de cookies/autenticação
}));

// Routes
const UserRoutes = require('./routes/userRoutes')
const ToughtRoutes = require('./routes/toughtRoutes')

app.use('/users', UserRoutes)
app.use('/toughts', ToughtRoutes)

app.listen(8080)
