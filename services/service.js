const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/Images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now())
    }
})

module.exports = storage