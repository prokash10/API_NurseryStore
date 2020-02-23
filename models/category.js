const mongoose =require('mongoose');

const categorySchema =mongoose.Schema({
    categoryName:{
        type:String
    },
    categoryImg:{
        type:String
    }
})

const category =mongoose.model('Category' ,categorySchema);
module.exports = category;