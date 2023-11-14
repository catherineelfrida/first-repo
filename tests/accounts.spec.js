const base = require('../app/controller/api/v1/accounts')

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

describe("accounts.get function", () => {
  test("res.json called with accounts data", async () => {
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

const nasabahid = 1
const accnumber = 99999999

describe("accounts.create function", () => {
  test("res.status called with 500 for internal server error", async () => {
    const req = mockRequest({
      nasabahid: "1",  // error 500 di database karena nasabahid harus int bukan string.
      accnumber: 9999999999,
      jenis: "Tabungan",
      saldo: 1000000 
    })
    const res = mockResponse()

    await base.create(req, res) 

    expect(res.status).toBeCalledWith(500)
    expect(res.json).toBeCalledWith({ error: 'Terjadi kesalahan server.' })
  })
  test("returns 400 for invalid input", async () => {
    const req = mockRequest({
        // Missing required fields
    })
    const res = mockResponse()
    await base.create(req, res)
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
          error: 'Data yang diberikan tidak valid.'
      })
    )
  })
  test("res.status called with 404 for customer not found", async () => {
    // Arrange
    // Assuming there is no existing user with the specified nasabahid
    const req = mockRequest({
      nasabahid: 999, // nasabahid yang tidak ada
      accnumber: 9999999999,
      jenis: "Tabungan",
      saldo: 1000000
    })
    const res = mockResponse();

    // Act
    await base.create(req, res);

    // Assert
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        error: 'Nasabah tidak ditemukan.'
      })
    )
  })
  test("res.json called with status 201 for valid input", async () => {
    const req = mockRequest({
      nasabahid: nasabahid,
      accnumber: accnumber,
      jenis: "Tabungan",
      saldo: 1000000
    })
    const res = mockResponse()

    await base.create(req, res)
    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: 'success',
        code: 201,
        message: 'Success add new account!',
        data: expect.any(Object)
      })
    )
  })
  test("res.status called with 409 for duplicate account number", async () => {
    // Arrange
    // Assuming there is existing user with the specified accnumber
    const req = mockRequest({
      nasabahid: nasabahid,
      accnumber: accnumber,
      jenis: "Tabungan",
      saldo: 1000000
    })
    const res = mockResponse();

    // Act
    await base.create(req, res);

    // Assert
    expect(res.status).toBeCalledWith(409);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        error: 'Nomor rekening sudah digunakan.'
      })
    )
  })
})

describe("accounts.delete function", () => {
  test("res.json called with bad request id", async () => {
    const req = mockRequest({}, {}, { id: "null" })
    const res = mockResponse()
    await base.destroy(req, res)
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: 'failed',
        code: 400,
        message: 'Bad request! Id is required',
      })
    )
  })
  test("res.json delete a account with id 999 and return 204", async () => {
    const req = mockRequest(
      {}, 
      {}, 
      { id: accnumber }
    )
    const res = mockResponse()
    await base.destroy(req, res)
    expect(res.status).toBeCalledWith(204)
  })
})