const { Producto, Categoria } = require("../models");

const { response } = require("express");

const agregarProducto = async (req, res = response) => {
  const { nombre, precio, categoria, descripcion } = req.body;

  const nombreProducto = await Producto.find({ nombre });

  if (!nombreProducto) {
    return res.status(400).json({
      msg: `El producto con el nombre ${nombre} ya existe`,
    });
  }

  const data = {
    nombre,
    precio,
    descripcion,
    categoria,
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  producto.save();

  res.status(200).json({
    producto,
  });
};

const obtenerProductos = async (req, res) => {
  const { limite = 5, desde = 0 } = req.params;

  const [total, productos] = await Promise.all([
    Producto.countDocuments({ estado: true }),
    await Producto.find({ estado: true })
      .populate("usuario categoria", "nombre")
      .skip(desde)
      .limit(limite),
  ]);

  if (!productos) {
    return res.status(400).json({
      msg: "No hay productos",
    });
  }

  res.status(200).json({
    total,
    productos,
  });
};

const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;

  const producto = await Producto.findById(id).populate(
    "usuario categoria",
    "nombre"
  );

  if (!producto) {
    return res.status(400).json({
      msg: `El producto con id ${id} no existe`,
    });
  }

  res.status(200).json({
    producto,
  });
};

const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  const productoEliminado = await Producto.findByIdAndUpdate(id, {
    estado: false,
  });

  if (!productoEliminado) {
    return res.status(400).json({
      msg: `El producto con id ${id} no existe`,
    });
  }

  res.status(200).json({
    productoEliminado,
  });
};

const actualizarProducto = async(req, res) => {
  const data = req.body;
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(id, {...data})

  if(!producto){
    return res.status(400).json({
      msg: `El producto con id ${id} no existe`
    })
  }

  res.status(200).json({
    producto
  })
};

module.exports = {
  agregarProducto,
  obtenerProductos,
  obtenerProductoPorId,
  eliminarProducto,
  actualizarProducto
};
