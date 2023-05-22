const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario:{
    //tipo de la id de mongo
    type: Schema.Types.ObjectId,
    //referencia del Schema Usuario
    ref: 'Usuario',
    required: true
  }
});

module.exports = model("Categoria", CategoriaSchema);
