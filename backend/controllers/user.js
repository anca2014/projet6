// CONTROLLER UTILISATEUR - contient la logique métier des routes utilisateur

// importation des packages bcrypt, jwt, email-validator, password-validator et mongo

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// importation du modèle utilisateur
const User = require('../models/User');

// exportation de la fonction qui va enregistrer un nouvel utilisateur
exports.signup =(req,res,next) => {
bcrypt.hash(req.body.password, 10)
.then(hash =>{
	const user = new User({
		email: req.body.email,
		password: hash
	});
	user.save()
	.then(()=> res.stutus(201).json({ message:'Utilisateur crée'}))
	.catch(error => res.status(400).json({error}));
})
.catch(error => res.status(500).json({error})); 
};

// exportation de la fonction qui va connecter un utilisateur déjà enregistré
exports.login = (req, res, next) =>{
 User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
            { userId: user._id},
            'TOKEN',
            { expiresIn: '24H'}
            )      
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
