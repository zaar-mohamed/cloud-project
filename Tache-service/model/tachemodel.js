const mongoose=require("mongoose");
const commentschema=mongoose.Schema({
    content:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"utilisateur",required:true},


})
const tacheschema=mongoose.Schema({
    titre:{type:String,required:true},
    description:{type:String,required:true}
    ,status:{type:String,required:true,enum:["à faire", "en cours", "terminé"],default:"à faire"},
    priorite:{type:String,required:true,enum:["moyenne","elevée","urgente"],default:"moyenne"},
    deadline:{type:Date,required:true},
    commentaire:[commentschema],
    projet_id:{type:mongoose.Schema.Types.ObjectId,ref:"projet",required:true},
    assignedUser:[{type:mongoose.Schema.Types.ObjectId,ref:"utilisateur"}],
    createdby:{type:mongoose.Schema.Types.ObjectId,ref:"utilisateur"}
})

module.exports=mongoose.model("taches",tacheschema)