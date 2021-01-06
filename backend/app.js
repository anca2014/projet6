// APPLICATION EXPRESS

// importation du framework express et des package body-parser, mongoose path et helmet
const express=require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const MaskData = require('maskdata');
const helmet = require("helmet");
require('dotenv').config();

// importation des routeurs sauce et utilisateur
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// connexion au cluster MongoDB - masquage des données de connexion
mongoose.connect
('mongodb+srv://'+ process.env.DB_USER +':' + process.env.DB_PASSWORD +'@cluster0.ciwot.mongodb.net/sauces?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// création de l'application express
const app=express();

const rateLimit = require("express-rate-limit");

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

//helmet securité
app.use(helmet());

/*middleware*/

// ajout de headers pour toutes les requêtes afin d'autoriser n'importe quel utilisateur à accéder à l'application
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');/*d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;*/
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  /*d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;*/
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();/*d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)*/
});

// transformation du corps des requêtes en objets javascript utilisables
app.use(bodyParser.json());

// gestion de la ressource images de manière statique
app.use('/images', express.static(path.join( __dirname, 'images')));

// enregistrement des routeurs sauce et utilisateur pour n'importe quelle requête effectuée vers /api/sauces et /api/auth
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

