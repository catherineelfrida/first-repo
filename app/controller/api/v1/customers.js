const { PrismaClient } = require('@prisma/client')

const prismadb = new PrismaClient()

module.exports = {
  async get(req, res) {
    const { search, page = 1, limit = 10 } = req.query
    
    const result = await prismadb.customer.findMany({
      skip: parseInt((page - 1) * limit),
      take: parseInt(limit),
    })
    
    if(!result.length) {
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Data Empty"
      })
    }
    
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success!",
      data: result
    })
  },
  async getById(req, res) {
    const { id } = req.params
    
    if(isNaN(id)) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "Bad request! Id is required"
      })
    }

    const result = await prismadb.customer.findUnique({
      where: { id: parseInt(id) }
    })
    
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success!",
      data: result
    })
  },
  async create(req, res) {
    try {
      const { nama, alamat, email, password } = req.body
      
      // Validasi input
      if (!nama || !email || !password || !alamat ) {
        return res.status(400).json({ error: 'Data yang diberikan tidak valid.' })
      }

      // Cek apakah email sudah terdaftar
      const user = await prismadb.customer.findFirst({
        where: { email }
      })

      if(user){
        return res.status(404).json({
          status: "Fail!",
          message: "Email sudah terdaftar!"
        })
      }

      // Tambahkan nasabah baru
      // const createdBy = req.customer
      const newCustomer = await prismadb.customer.create({
        data: {
          ...req.body,
          // createdBy: createdBy.nama
        }
      })
      
      return res.status(201).json({
        status: "success",
        code: 201,
        message: "Success add new customer!",
        data: newCustomer
      })
    } catch (error) {
      // console.error('Error:', error)
      res.status(500).json({ error: 'Terjadi kesalahan server.' })
    }
  },
  async destroy(req, res){
    if(isNaN(req.params.id)) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "Bad request! Id is required"
      })
    }
  
    await prismadb.customer.delete({
      where: { id: parseInt(req.params.id) }
    })
  
    // no content
    return res.status(204).json()
  }
}
