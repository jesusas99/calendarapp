const { Router } = require('express');
const { check } = require('express-validator');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt')
//TODAS DEBEN PASAR POR VALIDACION DEL JWT
router.use( validarJWT )
//obtener eventos
router.get('/' ,  getEventos);


//crear evento
router.post('/' , 
[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),


    validarCampos
], crearEvento );

//Actualizar evento
router.put('/:id' ,
[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
    check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),

    validarCampos
], actualizarEvento );

//borrar evento
router.delete('/:id' , eliminarEvento );


module.exports = router;