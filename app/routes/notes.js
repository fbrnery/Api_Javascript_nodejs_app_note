var express = require('express');
var router = express.Router();
const Note = require('../models/note.js');
const withAuth = require('../middlewares/auth');


router.post('/', withAuth, async (req, res) => {
     const { title, body } = req.body;
    
    try {
        let note = new Note({ title: title, body: body, author: req.user.id});
         await note.save();
         res.status(200).json(note);
       } catch (error) {
         res.status(500).json({error: 'Problem to create a note'});
       }
   });

   router.get('/:id', withAuth, async function(req, res) {

    try {
        const { id } = req.params;
        let note = await Note.findById(id);
        if(is_owner(req.user, note))
        res.json(note);
        else
        res.status(403).json({error: 'Permission denied'});
    }   catch (error) {
        res.status(500).json({error: 'Problem to get a note'}).status(500)
    }
});

const is_owner = (user, note) => {
     if(JSON.stringify(user._id) == JSON.stringify(note.author._id))
       return true;
     else
       return false;
   }


   module.exports = router;