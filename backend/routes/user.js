// ROUTEUR UTILISATEUR - contient la logique de routing utilisateur

// importation d'express et du controllers utilisateur
const express=require('express');
const router=express.Router();

// création d'un routeur express
const userCtrl = require('../controllers/user');

// application des fonctions de gestion des utilisateurs aux différentes routes

/*premier middleware*/
router.post ('/signup', userCtrl.signup);

/*deuxiéme middleware*/
router.post ('/login' , userCtrl.login);


// exportation du router
module.exports = router;