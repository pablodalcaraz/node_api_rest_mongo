const express= require('express');
const router = express.Router();
const Book= require('../models/book.model');

const getBook= async(req, res, next)=>{
    let book;
    const { id } = req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json(
            {
                message:'El id del libro no es vállido'
            }
        )
    }
    try{
        book= await Book.findById(id);
        if(!book){
            return res.status(404).json(
                {
                    message:'El libro no fue encontrado'
                }
            )
        }
    }catch(error){
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }
    res.book= book;
    next();

}

router.get('/', async (req, res)=>{
    try{
        const books= await Book.find();
        console.log('GET ALL', books);
        if(books.length === 0){
            res.status(204).json([]);
        }
        res.json(books);
    }catch (error){ 
        res.status(500).json({message:error.message})
    }
})

router.post('/',async (req, res)=>{
    const {titulo,autor,genero,fechaPublicacion} = req?.body;
    if(!titulo || !autor || !genero  || !fechaPublicacion){
        return res.status(400).json({
            message: 'Los campos título, autor, género y fecha son obligatorios'
        })
    }
    const book= new Book(
        {
            titulo,
            autor,
            genero,
            fechaPublicacion 
        }
    )
    try{
        const newBook = await book.save();
        console.log(newBook);
        res.status(201).json(newBook);
    }catch(error){
        res.status(400).json({
            message: error.message
        })

    }
})

router.get('/:id',getBook, async(req, res) => {
    res.json(res.book);
})

router.put('/:id',getBook, async(req, res) =>{
    try{
        const book= res.book
        book.titulo= req.body.titulo || book.titulo
        book.autor= req.body.autor || book.autor
        book.genero= req.body.genero || book.genero
        book.fechaPublicacion= req.body.fechaPublicacion || book.fechaPublicacion

        const updateBook = await book.save()
        res.json(updateBook)
    }catch(error){
        res.status(400).json({
            message: error.message
        })

    }
})

router.patch('/:id',getBook, async(req, res) =>{
    if(!req.body.titulo && !req.body.autor && !req.body.genero && !req.body.fechaPublicacion){
        res.status(400).json({
            message: 'Al menos uno de estos datos debe ser enviado: título, autor, género o fecha de publicación'
        })
    }
    try{
        const book= res.book
        book.titulo= req.body.titulo || book.titulo
        book.autor= req.body.autor || book.autor
        book.genero= req.body.genero || book.genero
        book.fechaPublicacion= req.body.fechaPublicacion || book.fechaPublicacion

        const updateBook = await book.save()
        res.json(updateBook)
    }catch(error){
        res.status(400).json({
            message: error.message
        })

    }
})

router.delete('/:id',getBook, async(req, res) => {
    try{
       const book= res.book
       await book.deleteOne({
        _id: book._id
       }) 
       res.json({
        message: `El libro ${book.titulo}, fue eliminado correctamente`
       })
    }catch(error){
       res.status(500).json({
        message: error.message
       })
    }
})
module.exports = router