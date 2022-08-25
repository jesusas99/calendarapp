
const express = require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = express.response) =>{

    const { email, password } = req.body; 
    try {
        let usuario = await Usuario.findOne({ email });
        
        if( usuario ){
            return res.status(400).json({
                ok:false,
                msg: 'ya existe un usuario con ese correo'
            })
        }
        
        usuario = new Usuario( req.body )
        
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();
        
        //GENERAR JWT
        const token = await generarJWT( usuario.id , usuario.name );

        res.status(201).json({
            ok: true,
            msg: 'register',
            uid: usuario.id,
            name: usuario.name,
            token
        })        
    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: 'Por favor hable con el administrador',
        })    
    }

}

const loginUsuario = async(req, res = express.response) =>{
    const { email, password } = req.body; 

    try {

        let usuario = await Usuario.findOne({ email });
        if( !usuario ){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no existe con ese email'
            })
        }

        //Confirmar los password

        const validPassword = bcrypt.compareSync( password, usuario.password );

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }
               

        //Generar JWT
        const token = await generarJWT( usuario.id , usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        }); 

    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: 'Por favor hable con el administrador',
        })          
    }
}

const revalidarToken = async(req, res = express.response) =>{

    const uid = req.uid;
    const name = req.name;

    //generar nuevo JWT y retornarlo

        const token = await generarJWT( uid , name);

    res.json({
        ok: true,
        uid, name,
        
        token
    })
}

module.exports = { crearUsuario, loginUsuario, revalidarToken };