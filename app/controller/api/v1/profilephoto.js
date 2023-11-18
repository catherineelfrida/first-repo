const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const imagekit = require('../../../../utils/imagekit');

module.exports = {
  upload: async(req, res) => {
    try {
      const { title, description } = req.body
      const customerId = parseInt(req.body.customerid)

      if (!title || !description || !customerId === undefined) {
        return res.status(400).json({error: 'Data yang diberikan tidak valid.'})
      }

      const stringFile = req.file.buffer.toString('base64')
  
      // Process upload file to ImageKit.io
      const uploadFile = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      })

      // Save image details to the database using Prisma
      const uploadedImage = await prisma.image.create({
        data: {
          title,
          description,
          imageUrl: uploadFile.url,
          customer: {
            connect: { id: customerId }
          }
        }
      })
  
      // Return response to the client
      return res.status(200).json({
        status: 'OK',
        message: 'Success',
        data: {
          id: uploadedImage.id,
          title: uploadedImage.title,
          description: uploadedImage.description,
          customerId: uploadedImage.customerId,
          imagekit: {
            name: uploadFile.name,
            url: uploadFile.url,
            type: uploadFile.fileType,
          }
        }
      })
    } catch(err) {
      console.error(err);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  },
  getAll: async (req, res) => {
    try {
      const { customerId } = req.body

      const profilePhotos = await prisma.image.findMany({ 
        where: { customerId: customerId }
      })
      res.json(profilePhotos)
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  },
  getDetail: async (req, res) => {
    try {
      const { id } = req.params;

      if(isNaN(req.params.id)) {
        return res.status(400).json({
          status: "failed",
          code: 400,
          message: "Bad request! Id is required"
        })
      }

      const profilePhoto = await prisma.image.findUnique({ where: { id: parseInt(id) } });

      if (!profilePhoto) {
        return res.status(404).json({ status: false, message: 'Profile Photo not found' });
      }

      res.json(profilePhoto);
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  },
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      
      if(isNaN(req.params.id)) {
        return res.status(400).json({
          status: "failed",
          code: 400,
          message: "Bad request! Id is required"
        })
      }

      const imageToDelete = await prisma.image.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!imageToDelete) {
        return res.status(404).json({ status: false, message: 'Image not found' });
      }
      
      await prisma.image.delete({ where: { id: parseInt(id) } })

      res.json({ status: true, message: 'Profile Photo deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  },
  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      
      if(isNaN(req.params.id)) {
        return res.status(400).json({
          status: "failed",
          code: 400,
          message: "Bad request! Id is required"
        })
      }

      if (!title || !description === undefined) {
        return res.status(400).json({error: 'Data yang diberikan tidak valid.'})
      }

      const existingImage = await prisma.image.findUnique({
        where: { id: parseInt(id) }
      })

      if (!existingImage) {
        return res.status(404).json({status: false, message: 'Profile Photo not found'})
      }

      const updatedProfilePhoto = await prisma.image.update({
        where: { id: parseInt(id) },
        data: { title, description },
      });

      res.json({ status: true, message: 'Profile Photo updated successfully', data: updatedProfilePhoto });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  }
}