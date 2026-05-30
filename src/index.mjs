require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Validación corporativa de seguridad
if (process.env.NODE_ENV === "production" && !process.env.STOCK_SECRET) {
  console.error(
    "ERROR: STOCK_SECRET no configurada. Bloqueo de seguridad activado."
  );
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Simulación de base de datos
let productos = [
  {
    id: "prod-50",
    nombre: "Café Sello Rojo 500g",
    categoria: "Despensa",
    precio: 14500,
    stock: 120,
    bodega: "Medellín-Sur",
  },
  {
    id: "prod-51",
    nombre: "Leche Alquería Entera 1L",
    categoria: "Lácteos",
    precio: 4300,
    stock: 15,
    bodega: "Medellín-Centro",
  },
  {
    id: "prod-52",
    nombre: "Arroz Diana 1kg",
    categoria: "Despensa",
    precio: 5200,
    stock: 80,
    bodega: "Medellín-Norte",
  },
  {
    id: "prod-53",
    nombre: "Huevos Kikes AA 30u",
    categoria: "Huevos",
    precio: 18500,
    stock: 45,
    bodega: "Medellín-Sur",
  },
  {
    id: "prod-54",
    nombre: "Aceite Premier 1L",
    categoria: "Despensa",
    precio: 9800,
    stock: 60,
    bodega: "Medellín-Centro",
  },
];

// Ruta pública
app.get("/api/productos", (req, res) => res.json(productos));

// Auth Login
app.post("/api/auth/login", (req, res) => {
  const { user } = req.body;
  if (user === "admin") {
    const token = jwt.sign({ user }, process.env.STOCK_SECRET);
    return res.json({ token });
  }
  res.status(401).send("Acceso denegado");
});

// Ruta protegida POST
app.post("/api/productos", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Token requerido");

  try {
    jwt.verify(token.split(" ")[1], process.env.STOCK_SECRET);
    productos.push(req.body);
    res.status(201).send("Producto agregado con éxito");
  } catch (e) {
    res.status(403).send("Token inválido");
  }
});

app.listen(process.env.PORT || 8080, () =>
  console.log("MercaoYa API Operativa")
);
