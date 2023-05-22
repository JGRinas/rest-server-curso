const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");

const { validarJWT, esAdminRole } = require("../middlewares");

const {
  existeCategoriaPorId,
  existeProductoPorId,
} = require("../helpers/db-validators");

const {
  agregarProducto,
  obtenerProductos,
  obtenerProductoPorId,
  eliminarProducto,
  actualizarProducto
} = require("../controllers/productos");

const router = Router();

//crear producto
router.post(
  "/",
  [
    validarJWT,
    esAdminRole,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "El id de categoria es obligatorio").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  agregarProducto
);
//obtener productos
router.get("/", obtenerProductos);
//obtener productos por id
router.get(
  "/:id",
  [
    check("id", "El id de la categoria es obligatorio").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProductoPorId
);
//actualizar producto
router.put("/:id", actualizarProducto);
//eliminar producto
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "La id del producto es obligatoria").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  eliminarProducto
);

module.exports = router;
