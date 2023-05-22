const { Categoria } = require("../models");

//obtenerCategorias - paginado - total - populate

const obtenerCategorias = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    await Categoria.find({ estado: true })
      .populate("usuario", "nombre correo")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  if(!categorias){
    return res.status(400).json({
        msg: 'No hay categorias'
    })
  }

  res.status(200).json({
    total,
    categorias
  });
};

//obtenerCategorias - populate
const obtenerCategoriaPorId = async (req, res) => {
  const { id } = req.params;

  const categoriaPorId = await Categoria.findById(id).populate(
    "usuario",
    "nombre correo"
  );

  if(!categoriaPorId){
    return res.status(400).json({
        msg: 'La categoría no existe'
    })
  }

  res.status(200).json({
    categoriaPorId
  })
};

const crearCategoria = async (req, res) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }

  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  await categoria.save();

  res.status(201).json({
    msg: "Categoria creada",
    categoria,
  });
};

// actualizarCategoria
const actualizarCategoria = async(req, res) => {
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();

    const categoriaActualizada = await Categoria.findByIdAndUpdate(id, nombre)

    if(!categoriaActualizada){
        return res.status(400).json({
            msg: 'la categoría no existe'
        })
    }

    res.status(200).json({
        categoriaActualizada
    })
}

// borrarCategoria - estado : false
const borrarCatergoria = async(req, res) => {
    const {id} = req.params;

    const categoriaEliminada = await Categoria.findByIdAndUpdate(id, {estado: false})
    if(!categoriaEliminada){
        return res.status(400).json({
            msg: 'La categoría no existe'
        })
    }

    res.status(200).json({
        categoriaEliminada
    })
}


module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  borrarCatergoria,
  actualizarCategoria
};
