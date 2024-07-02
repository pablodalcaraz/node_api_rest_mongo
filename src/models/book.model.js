const mongoose= require('mongoose');

const bookSchema= new mongoose.Schema(
    {
      titulo:String,
      autor:String,
      genero:String,
      fechaPublicacion:String

    }
)

module.exports= mongoose.model('Book',bookSchema);