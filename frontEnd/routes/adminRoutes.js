const express = require('express')
const router = express.Router()
const fs = require('fs').promises;
const path = require('path');


const randomId = () => {
   // Generate a random number between 1000000000 and 9999999999
   return Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
};

router.get('/staff', (req, res) => {

   res.json('The get function is working')
})


router.post('/upload', (req, res) => {

   res.status(200).json({message: `File sent ${req.id}`})
   return
   if(req.files === null){
      return res.status(400).json({
         message: 'No file was selected'
      })
   }

   const file = req.files.file
  
   try {
      console.log('workingnsinibnfer')

      file.mv(__dirname + '/uploads/' + file.name, 
      err => {
          if(err){
              console.log(err)
              return res.status(500).send(err)
          }

          res.json({
              fileName: file.name, 
              filePath: `/uploads/${file.name}`
               })
            }
      )
            
   } catch (error ) {
       console.log(error);
      res.status(400).json({ message: 'An error occurred while uploading the file' });
   }

})

module.exports = router