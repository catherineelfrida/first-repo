const { PrismaClient } = require('@prisma/client')

const prismadb = new PrismaClient()

module.exports = {
  async get(req, res) {
    const result = await prismadb.transaction.findMany()
    
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success!",
      data: result
    })
  },
  async getById(req, res) {
    const { id } = req.params

    const result = await prismadb.transaction.findUnique({
      where: { id: parseInt(id) },
      include: {
        srcnumber: {
          include: {
            customer: {
              select: { nama: true }
            }
          }
        },
        destnumber: {
          include: {
            customer: {
              select: { nama: true }
            }
          }
        }
      }
    })
    
    if (!result) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
    }

    const data = {
      id: result.id,
      pengirim: result.srcnumber.customer.nama,
      penerima: result.destnumber ? result.destnumber.customer.nama : null,
      srcacc: result.srcacc,
      destacc: result.destacc,
      transactiontype: result.transactiontype,
      jumlah: result.jumlah,
    }

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success!",
      data: data
    })
  },
  async deposit(req, res) {
    try {
      const { accnumber, jumlah } = req.body

      // Validasi input
      if (!accnumber || !jumlah || jumlah <= 0) {
        return res.status(400).json({ error: 'Data yang diberikan tidak valid.' })
      }

      // Cari akun berdasarkan nomor rekening
      const account = await prismadb.account.findFirst({
        where: { accnumber: accnumber }
      })

      if (!account) {
        return res.status(404).json({ error: 'Akun tidak ditemukan.' })
      }

      // Lakukan deposit dan catat transaksi
      const newBalance = account.saldo + jumlah

      const result = await prismadb.account.update({
        where: { accnumber: account.accnumber },
        data: { saldo: newBalance }
      })

      await prismadb.transaction.create({
        data: {
          srcacc: account.accnumber,
          destacc: null, // Deposit, tidak ada akun tujuan
          transactiontype: 'deposit',
          jumlah: jumlah
        }
      })
      
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Deposit berhasil.",
        data: result
      })
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan server.' })
    }
  },
  async withdraw(req, res) {
    try {
      const { accnumber, jumlah } = req.body

      // Validasi input
      if (!accnumber || !jumlah || jumlah <= 0) {
        return res.status(400).json({ error: 'Data yang diberikan tidak valid.' })
      }

      // Cari akun berdasarkan nomor rekening
      const account = await prismadb.account.findFirst({
        where: { accnumber: accnumber }
      })

      if (!account) {
        return res.status(404).json({ error: 'Akun tidak ditemukan.' })
      }

      // Lakukan withdraw dan catat transaksi
      const newBalance = account.saldo - jumlah

      const result = await prismadb.account.update({
        where: { accnumber: account.accnumber },
        data: { saldo: newBalance }
      })

      await prismadb.transaction.create({
        data: {
          srcacc: account.accnumber,
          destacc: null, // Deposit, tidak ada akun tujuan
          transactiontype: 'withdraw',
          jumlah: jumlah
        }
      })
      
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Penarikan berhasil.",
        data: result
      })
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan server.' })
    }
  },
  async transfer(req, res) {
    try {
      const { srcaccnumber, destaccnumber, jumlah } = req.body

      // Validasi input
      if (!srcaccnumber || !destaccnumber || !jumlah || jumlah <= 0) {
        return res.status(400).json({ error: 'Data yang diberikan tidak valid.' })
      }

      // Cari akun sumber (srcacc) berdasarkan nomor rekening
      const srcAccount = await prismadb.account.findFirst({
        where: { accnumber: srcaccnumber },
      })

      // Cari akun tujuan (destacc) berdasarkan nomor rekening
      const destAccount = await prismadb.account.findFirst({
        where: { accnumber: destaccnumber },
      })      

      if (!srcAccount || !destAccount) {
        return res.status(404).json({ error: 'Akun sumber atau akun tujuan tidak ditemukan.' })
      }

      // Lakukan transfer dan catat transaksi
      if (srcAccount.saldo >= jumlah) {
        const newSrcBalance = srcAccount.saldo - jumlah;
        const newDestBalance = destAccount.saldo + jumlah;
  
        await prismadb.account.update({
          where: { accnumber: srcAccount.accnumber },
          data: { saldo: newSrcBalance },
        });
  
        await prismadb.account.update({
          where: { accnumber: destAccount.accnumber },
          data: { saldo: newDestBalance },
        });
  
        const result = await prismadb.transaction.create({
          data: {
            srcacc: srcAccount.accnumber,
            destacc: destAccount.accnumber,
            transactiontype: 'transfer',
            jumlah: jumlah,
          }
        });   
        
        return res.status(200).json({
          status: 'success',
          code: 200,
          message: 'Transfer berhasil.',
          data: result
        })
      } else {
        return res.status(400).json({ error: 'Saldo akun sumber tidak mencukupi untuk transfer.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan server.' })
    }
  }
}
