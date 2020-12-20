// APPLICATION EXPRESS

// importation du framework express et des package body-parser, mongoose path et helmet
const express=require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// importation des routeurs sauce et utilisateur
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// connexion au cluster MongoDB - masquage des données de connexion
mongoose.connect("mongodb+srv://aurelie:Catalina19@cluster0.ciwot.mongodb.net/sauces?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// création de l'application express
const app=express();
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
module.exports=app;
