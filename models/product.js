const mongoose =require('mongoose');

const productSchema =mongoose.Schema({
    Productname:{
        type:String
        
    },
    Productimage:{
        type:String
        
    },
    Productdescription:{
        type:String
        
    },
    Price:{
        type:Number
    },
    quantity:{
        type:Number

    },
    Date:{
        type:Date
    },
    Categoryid: {
        type: String
    }

});

const products =mongoose.model('Product', productSchema);
module.exports =products;