// ROUTEUR SAUCE - contient la logique de routing sauce

//importation d'express, du controller sauce et des middleware auth et multer-config
const express=require('express');
const stuffCtrl = require('../controllers/sauce');
const Sauce = require('../models/Sauce');
const auth = require('../middleware/auth');
const multer =require('../middleware/multer-config')

// création d'un routeur express
const router=express.Router();

/**************Premier middleware************ POST************************/
router.post('/', auth, multer, stuffCtrl.createSauce);
/*****************Deuxiéme middleware**********PUT*************************/
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
/*******************Troisiéme middleware*******DELETE***********************/
router.delete('/:id', auth, stuffCtrl.deleteSauce);
/******************Quatrieme middleware*******GET:id*************************/
router.get('/:id', auth, stuffCtrl.getOneSauce);
/*******************Cinquieme Middleware***********************************/
router.post('/:id/like',auth, stuffCtrl.likeSauce);
/*******************Sixiéme middleware************GET*******************/
router.get('/', auth, stuffCtrl.getAllSauces);
/*******************************************************************************/

// exportation du routeur
module.exports = router;