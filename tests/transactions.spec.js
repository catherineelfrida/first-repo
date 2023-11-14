const base = require('../app/controller/api/v1/transactions')

const mockRequest = ( body = {}, query = {}, params = {} ) => ({ 
  body, 
  query, 
  params 
})
                    
const mockResponse = () => {
  const res = {}
  res.json = jest.fn().mockReturnValue(res)
  res.status = jest.fn().mockReturnValue(res)
  return res
}

describe("transactions.get function", () => {
  test("res.json called with transactions data", async () => {
    const req = mockRequest()
    const res = mockResponse()
    await base.get(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Success!",
        data: expect.any(Array)
      })
    )
  })
})

describe("transactions.getById function", () => {
  test("res.json called with transaction data for a valid ID", async () => {
    // Assuming you have a customer with ID 1 in your database
    const req = mockRequest(
      {}, 
      {}, 
      { id: 1 }
    )
    const res = mockResponse()
    await base.getById(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: 'success',
        code: 200,
        message: 'Success!',
        data: expect.any(Object)
      })
    )
  })
  test("res.status called with 404 for an invalid IDD", async () => {
    const req = mockRequest({}, {}, { id: 999 })
    const res = mockResponse()
    await base.getById(req, res)
    expect(res.status).toBeCalledWith(404)
    expect(res.json).toBeCalledWith({
      error: 'Transaksi tidak ditemukan.',
    })
  })
})

describe("transactions.deposit function", () => {
  test("res.json called with status 200", async () => {
    const req = mockRequest({ 
      accnumber: 12345, 
      jumlah: 100
    })
    const res = mockResponse();
  
    await base.deposit(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: 'success',
        code: 200,
        message: 'Deposit berhasil.',
        data: expect.any(Object)
      })
    )
  })
  test("res.json called with 400 for invalid input", async () => {
    const req = mockRequest({ 
      // Missing required fields
    })
    const res = mockResponse();
  
    await base.deposit(req, res)

    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        error: 'Data yang diberikan tidak valid.'
      })
    )
  })
  test("res.json called with 404 for account not found", async () => {
    const req = mockRequest({
      accnumber: 99999, // accnumber yang tidak ada 
      jumlah: 100 
    })
    const res = mockResponse()

    await base.deposit(req, res)
    
    expect(res.status).toBeCalledWith(404)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        error: 'Akun tidak ditemukan.'
      })
    )
  })
})

// describe("transactions.withdraw function", () => {
//   test("res.json called with bad request id", async () => {
//     const req = mockRequest({}, {}, { id: "null" })
//     const res = mockResponse()
//     await base.destroy(req, res)
//     expect(res.status).toBeCalledWith(400)
//     expect(res.json).toBeCalledWith(
//       expect.objectContaining({
//         status: 'failed',
//         code: 400,
//         message: 'Bad request! Id is required',
//       })
//     )
//   })
//   test("res.json delete a account with id 999 and return 204", async () => {
//     const req = mockRequest(
//       {}, 
//       {}, 
//       { id: accnumber }
//     )
//     const res = mockResponse()
//     await base.destroy(req, res)
//     expect(res.status).toBeCalledWith(204)
//   })
// })

// describe("transactions.transfer function", () => {
//   test("res.json called with bad request id", async () => {
//     const req = mockRequest({}, {}, { id: "null" })
//     const res = mockResponse()
//     await base.destroy(req, res)
//     expect(res.status).toBeCalledWith(400)
//     expect(res.json).toBeCalledWith(
//       expect.objectContaining({
//         status: 'failed',
//         code: 400,
//         message: 'Bad request! Id is required',
//       })
//     )
//   })
//   test("res.json delete a account with id 999 and return 204", async () => {
//     const req = mockRequest(
//       {}, 
//       {}, 
//       { id: accnumber }
//     )
//     const res = mockResponse()
//     await base.destroy(req, res)
//     expect(res.status).toBeCalledWith(204)
//   })
// })