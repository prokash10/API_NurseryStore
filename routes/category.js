const express = require('express');
const Category =require('../models/category');
const multer =require('multer')
const path =require("path");
const router = express.Router();
const mongoose =require('mongoose');
const auth='../auth.js';

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

//post categorys
router.post('/',upload.single('categoryImg'),(req,res)=>{
    let newCategory = new Category({
        categoryName:req.body.categoryName,
        categoryImg:req.file.filename
    });
    console.log(newCategory)
    newCategory.save().then((CategoryDoc)=>{
        res.send(CategoryDoc);
    });
});


router.get('/list', (req, res) => {
   Category.find({})
   .then((categorylist)=>{
       res.send(categorylist);
   }).catch((err)=>{
       res.send('Error',err.message)
   })
})

module.exports = router;