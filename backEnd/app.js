import express from 'express'
import fs from 'fs'
import multer from 'multer'
import cors from 'cors'

const app = express()

app.use(cors())

const port = 8000

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage')
  },
  filename:  (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({storage}).single('file')

// On stocke dans le dossier storage et on appelle la fonction fileUploaded
app.post('/upload', (req, res, next) => {
  upload(req, res, (err) => {
    // console.log("req.file : ---> ", req.file);
    if(err){
      return res.status(500).json(err)
    }
    // console.log("req.file : ---> ", req.file.filename);
    next()
  })
},
fileUploaded
)

// Cette fonction lit le fichier txt s'il existe, et teste pour chaque ligne
// Si le nombre est divisible par 3, elle affiche Fizz
// S’il est divisible par 5, elle affiche Buzz
// S’il est divisible par 3 et par 5,elle affiche FizzBuzz
// Et retourn le resultat dans un tableau "results"
function fileUploaded(req, res) {
    fs.readFile('./storage/' + req.file.filename, { encoding: 'utf8' }, (err, data) => {
        if (err) return res.status(500).json(err);
        const results = []
        const lines = data.split('\n');
        for (let line of lines) {
            if (line % 5 === 0 && line % 3 === 0) results.push('Fizz Buzz');
            else {
                if (line % 3 === 0) results.push('Fizz');
                if (line % 5 === 0) results.push('Buzz');
            }
        }
        // console.log("resutl ", results);
        res.send(results)
      });
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})