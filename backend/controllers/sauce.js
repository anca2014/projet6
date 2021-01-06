//  controllers/route.js contient la logique metiers des routes sauces

// importation du modèle sauce
const Sauce = require('../models/Sauce');

// importation des packages fs
const fs = require('fs');

/******************exportation de la fonction qui va créer une sauce (gère la route POST)***********************/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
  .then(() => {res.status(201).json({message: 'Post saved successfully!'});})
  .catch(error => res.status(400).json({error}))
};
/***************** exportation de la fonction qui va modifier une sauce (gère la route PUT)************************/
exports.modifySauce = (req, res, next) =>{
 const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id},{...sauceObject, _id: req.params.id})
  .then(()=> res.status (200).json({ message:'modifié'}))
  .catch(error => res.status(400).json({error}))
};
/******************exportation de la fonction qui va supprimer une sauce (gère la route DELETE)*************************/
exports.deleteSauce = (req,res,next) => {
  Sauce.findOne({ _id: req.params.id })
  .then( sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id})
      .then(() => res.status(200).json({ message: 'sauce supprimé' })) 
      .catch( error => res.status(400).json({ error}));
    });
  })
  .catch(error => res.status(400).json({ error}))
};
/************** exportation de la fonction qui va récupérer une seule sauce (gère la route GET)*************************/
exports.getOneSauce = (req,res,next)=>{
  Sauce.findOne({_id:req.params.id})
  .then( sauce=>res.status(200).json(sauce))/*promesse*/
  .catch(error=> res.status(404).json({error}))
};
/************************exportation de la fonction qui va gérer les likes et les dislikes******************************/
exports.likeSauce = (req,res,next) =>{
  const like = req.body.like;
  const userId = req.body.userId;
    if (like === 1) { // l'utilisateur like la sauce
        Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: userId}}) // incrémentation des likes, sauvegarde de l'utilisateur dans usersLiked
            .then(() => res.status(200).json({message: 'L\'utilisateur like la sauce !'}))
            .catch(error => res.status(400).json({error}));
    } else if (like === -1) { // l'utilisateur dislike la sauce
        Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: userId}}) // incrémentation des dislikes, sauvegarde de l'utilisateur dans usersDisliked
            .then(() => res.status(200).json({message: 'L\'utilisateur dislike la sauce !'}))
            .catch(error => res.status(400).json({error}));
    } else if (like === 0) { // l'utilisateur retire son like ou son dislike
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                if (sauce.usersLiked.includes(userId)) { // s'il retire son like
                    Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: userId}}) // décrémentation des likes, suppression de l'utilisateur dans usersLiked
                        .then(() => res.status(200).json({message: 'L\'utilisateur ne like plus la sauce !'}))
                        .catch(error => res.status(400).json({error}));
                } else if (sauce.usersDisliked.includes(userId)) { // s'il retire son dislike
                    Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}}) // décrémentation des dislikes, suppression de l'utilisateur dans usersDisliked
                        .then(() => res.status(200).json({message: 'L\'utilisateur ne dislike plus la sauce !'}))
                        .catch(error => res.status(400).json({error}));
                }
            })
  .catch(error=> res.status(404).json({error}))
}
};
/*****************exportation de la fonction qui va récupérer toutes les sauces (gère la route GET)******************/
exports.getAllSauces = (req, res, next) => {
      Sauce.find()
      .then(sauces=> res.status(200).json(sauces))//promesse
      .catch(error=>res.status(400).json({error}))
};
 
