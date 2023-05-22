const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");

const { validarJWT, esAdminRole } = require("../middlewares");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  borrarCatergoria,
  actualizarCategoria,
} = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");

const router = Router();

//obtener todas las categorias - publico
router.get("/", obtenerCategorias);

//obtener una categoria por id - publico - middleware para validar el id check('id').custom(existeCategoria)
router.get(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoriaPorId
);

//crear categoria - privado - cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),

    validarCampos,
  ],
  crearCategoria
);

//Actualizar - privado- cualquiera con token valido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    check("nombre", "El nombre es necesario").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

//Borrar una categoria - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  borrarCatergoria
);

module.exports = router;
