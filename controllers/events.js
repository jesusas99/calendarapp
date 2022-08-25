const express = require('express');
const Evento = require('../models/Eventos');

const getEventos = async ( req , res = express.response ) => {
        const eventos = await Evento.find().populate('user',  'name');
        res.status(200).json({
            ok: true,
            msg: 'getEventos',
            eventos
        });
}


const crearEvento = async ( req , res = express.response ) => {
    const evento = new Evento( req.body );
    try {
      
        evento.user = req.uid;

        const eventoSaved = await evento.save();


        res.status(200).json({
            ok: true,
            evento: eventoSaved
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: true,
            msg: 'hubo un error en crearEvento'
        });
    }
}

const actualizarEvento = async ( req , res = express.response ) => {
    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById( eventoId );

        if(!evento ){
            return res.status(404).json({
                ok: true,
                msg: 'evento no exise' 
            })
        }
        if( evento.user.toString() !== uid ){
            return res.status(404).json({
                ok: true,
                msg: 'no puede editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true });

        res.status(200).json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: true,
            msg: 'hubo un error en actualizarEvento'
        });
    }
}


const eliminarEvento = async ( req , res = express.response ) => {
    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById( eventoId );

        if(!evento ){
            return res.status(404).json({
                ok: true,
                msg: 'evento no exise' 
            })
        }
        if( evento.user.toString() !== uid ){
            return res.status(404).json({
                ok: true,
                msg: 'no puede eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete( eventoId );

        res.status(200).json({
            ok: true,
            evento: 'evento eliminado'
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: true,
            msg: 'hubo un error en eliminarEvento'
        });
    }
}

module.exports = { getEventos, crearEvento , actualizarEvento, eliminarEvento};