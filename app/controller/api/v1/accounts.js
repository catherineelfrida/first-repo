const { PrismaClient } = require('@prisma/client')

const prismadb = new PrismaClient()

module.exports = {
  async get(req, res) {
    const result = await prismadb.account.findMany()
    
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success!",
      data: result
    })
  },
  async create(req, res) {
    try {
      const { nasabahid, accnumber, jenis, saldo } = req.body
      
      // Validasi input
      if (!nasabahid || !accnumber || !jenis || saldo === undefined) {
        return res.status(400).json({ error: 'Data yang diberikan tidak valid.' })
      }

      // Cari nasabah berdasarkan ID
      const customer = await prismadb.customer.findUnique({
        where: { id: nasabahid }
      })

      if (!customer) {
        return res.status(404).json({ error: 'Nasabah tidak ditemukan.' });
      }

      // Cari akun berdasarkan nomor rekening
      const account = await prismadb.account.findFirst({
        where: { accnumber: accnumber }
      })

      if (account) {
        return res.status(409).json({ error: 'Nomor rekening sudah digunakan.' })
      }

      // Tambahkan akun baru
      const newAccount = await prismadb.account.create({
        data: {
          nasabahid: nasabahid,
          accnumber: accnumber,
          jenis: jenis,
          saldo: saldo
        }
      })
      
      return res.status(201).json({
        status: "success",
        code: 201,
        message: "Success add new account!",
        data: newAccount
      })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Terjadi kesalahan server.' })
    }
  }
}