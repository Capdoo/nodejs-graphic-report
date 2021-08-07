const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
//const MySql = require('express-mysql-session');
const MySQLStore = require('express-mysql-session');
const {database} = require('./keys');

//Inicializar
const app = express();

//Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine','.hbs');
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//Middlewares
app.use(session({
    secret: 'misession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());




//Variables Globales
app.use((req, res, next) => {
    app.locals.success =  req.flash('success');
    next();

});





//Rutas del sitio
app.use(require('./routes/routes.js'));
app.use(require('./routes/authentication.js'));
app.use('/links',require('./routes/links.js'));





//Archivos Publicos
app.use(express.static(path.join(__dirname,'public')));




//Comenzar el Servidor
app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
});


