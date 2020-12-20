// MODELE DE SAUCE

// importation du package mongoose
const mongoose = require('mongoose');

// création du schéma de données qui contient les caractéristiques pour chaque sauce
const sauceSchema = mongoose.Schema({
      userId:{type:String, required:true},
      name:{type: String, required:true},
      manufacturer:{type:String,required:true},
      description:{type:String,required:true},
      imageUrl: {type:String,required:true},
      heat:{type:Number,required:true},
      likes:{type:Number,required:true, default:0},
      dislikes:{type:Number,required:true, default:0},
      usersLiked:{type:[String],required:true, default:[]},
      usersDisliked:{type:[String],required:true, default:[]},
});

// exportation du modèle de sauce
module.exports = mongoose.model('Sauce', sauceSchema);