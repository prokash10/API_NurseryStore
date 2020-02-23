const express = require('express');
const product =require('../models/product');
const multer =require('multer')
const path =require("path");
const router = express.Router();
const mongoose =require('mongoose');
const auth='../auth.js';


//get all the product or items list
router.get('/list', async (req, res) => {
    const data = await product.find({})
    res.send(data)
 })
router.get('/medicinelist/:id',(req,res,next)=>{
    console.log(req.params.id);
    product.findById(req.params.id).exec().then(doc=>{
            res.send(doc.toJSON());
        }).catch((e)=>{
            res.send(e);
        })
})

//path to store image
const storage = multer.diskStorage({
    destination: "./upload/productlist",
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});
//check file types
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("You can upload only image files!"), false);
    }
    cb(null, true);
};
const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter
});
router.post('/save',upload.single('Productimage'),(req,res)=>{
    let newProduct = new product({
        Productname:req.body.Productname,
        Productimage:req.file.filename,
        Productdescription:req.body.Productdescription,
        Price:req.body.Price,
        quantity:req.body.quantity,
        Date:Date.now("MM-DD-YYYY"),
        Categoryid: req.body.Categoryid
    });
    newProduct.save().then((productDoc)=>{
        res.send(productDoc)
    })
});

router.get('/getByCategory/:id', async(req,res)=>{
    try{
        console.log("here")
        const id = req.params.id
        const data = await product.find({Categoryid:id})
        res.json(data);
    }
    catch(err){
        res.status(404).send(err);
    }
})

//get single products or items by id
router.patch('/product/:productId',upload.single('imageFile'),(req, res) => {
    product.findOne({
        _id: req.params.productId
    }).then((product) => {
        if (product) {
            return true;
        }
        return false;
    }).then((canUploadImage) => {
        if (canUploadImage) {
            Product.findOneAndUpdate({
                    _id: req.params.productId
                }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'product updated successfully' })
            })
        } else {
            res.sendStatus(404);
        }
    })
});

router.delete("/:productId",(req,res,next)=>{
    const id=req.params.productId;
    product.remove({_id:id}).exec().then(result=>{
        res.status(200).json(res);
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
})
module.exports=router;
