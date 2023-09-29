const multer = require('multer')


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

 const storage = multer.diskStorage({

        destination: function (req, file, cb) {
            const isValid  = FILE_TYPE_MAP[file.mimetype ]
            let uploaderror = new Error('Invalid file')
            if(isValid){
                uploaderror = null
            }
        cb(uploaderror, 'Public/uploads')
        },
        filename: function (req, file, cb) {
            const filename = file.originalname.split(' ').join('_')
            const extention = FILE_TYPE_MAP[file.mimetype]
        //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${filename +'-'+ Date.now()}.${extention}`)
        }
})
const upload = multer({ storage: storage })

module.exports = upload;