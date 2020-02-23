const mongoose =require('mongoose')
mongoose.Promise=global.Promise
mongoose.connect('mongodb://localhost:27017/PlantStore',{
    useNewUrlParser:true,
    userUnifiedTopology:true
})
.then(()=>{
    console.log("Database has been successfully connected");
})
.catch((e)=>{
    console.log("Error while connnecting");
    console.log(e.toString());
});

mongoose.set('useCreateIndex','true');
mongoose.set('useFindAndModify','false');

module.exports =mongoose;