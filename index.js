
const express = require( 'express' );
const { dbConnection } = require( './database/config' );
const cors  = require( 'cors' );
require( 'dotenv' ).config();

//Crear servidor de express

const app = express();


//BDD
dbConnection();

app.use( cors() )

//directorio publico
app.use( express.static( 'public' ) );

//lectura y parseo del body
app.use( express.json() );


//rutas
app.use('/api/auth', require( './routes/auth' ) );
app.use('/api/events', require( './routes/events' ) );


app.get('*', ( req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

//escuchar peticiones
app.listen( process.env.PORT, ( ) => {
    console.log( `Servidor en puerto ${ 4000 }` );
} );
