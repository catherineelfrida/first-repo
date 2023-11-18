const express = require('express');
const router = express.Router();
const controller = require('../app/controller')
const multer = require('multer')();

router.use('/images', express.static('public/images'))


router.post('/api/v1/profilephoto',
  multer.single('image'),
  controller.profilephoto.upload
)
router.get('/api/v1/profilephoto',
  controller.profilephoto.getAll
)
router.get('/api/v1/profilephoto/:id',
  controller.profilephoto.getDetail
)
router.delete('/api/v1/profilephoto/:id',
  controller.profilephoto.destroy
)
router.put('/api/v1/profilephoto/:id',
  controller.profilephoto.edit
)

module.exports = router;