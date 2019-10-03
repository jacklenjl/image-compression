const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://brad:hasbjd123@cluster0-1dome.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true,useUnifiedTopology: true});
var Schema = mongoose.Schema;
var imgSchema = new Schema({
    imgName:String,
    });
    const img = mongoose.model('img', imgSchema);

    module.exports=img;