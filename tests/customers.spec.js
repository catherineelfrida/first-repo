// unit testing
const base = require('../app/controller/api/v1/customers')

const mockRequest = ( body = {}, query = {}, params = {} ) =>({
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

// get user test, test suite untuk user get
describe("customers.get function", () => {
  //uji fungsionalitas
  test("res.json called with users data", async () => {
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
  //uji edge case ketika data kosong
  test("res.json called with no result", async () => {
    const req = mockRequest({}, {
        page:10
    })
    const res = mockResponse()
    await base.get(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: 'success',
            code: 200,
            message: 'Data Empty',
        })
    )
  })
})

const id = 999

describe("customers.create function", () => {
  test("res.status called with 500 for internal server error", async () => {
    const req = mockRequest({
      id: id,
      nama: "test2",
      alamat: "Jl. Test",
      email: "test1@gmail.com",
      password: 1234 // error 500 di database karena password harus string bukan int. 
    })
    const res = mockResponse()

    await base.create(req, res) 

    // console.log(res.json.mock.calls[0][0])
    expect(res.status).toBeCalledWith(500)
    expect(res.json).toBeCalledWith({ error: 'Terjadi kesalahan server.' })
  })

  test("res.json called with status 201 for valid input", async () => {
    const req = mockRequest({
      id: id,
      nama: "test1",
      alamat: "Jl. Test",
      email: "test1@gmail.com",
      password: "1234"
    })
    const res = mockResponse()
    await base.create(req, res)
    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: 'success',
        code: 201,
        message: 'Success add new customer!',
        data: expect.any(Object)
      })
    )
  })
  // uji edge case ketika data tidak valid
  test("res.status called with 400 for invalid input data", async () => {
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
  test("res.status called with 404 for existing email", async () => {
    // Arrange
    // Assuming there is an existing user with the specified email
    const req = mockRequest({
      id: id,
      nama: "test1",
      alamat: "Jl. Test",
      email: "test1@gmail.com",
      password: "1234"
    })
    const res = mockResponse();

    // Act
    await base.create(req, res);

    // Assert
    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: 'Fail!',
        message: 'Email sudah terdaftar!'
      })
    )
  })
})

describe("customers.getById function", () => {
  test("res.json called with bad request id", async () => {
    const req = mockRequest({}, {}, { id: "null" })
    const res = mockResponse()
    await base.getById(req, res)
    expect(res.status).toBeCalledWith(400)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: 'failed',
        code: 400,
        message: 'Bad request! Id is required',
      })
    )
  })
  test("res.json called with user data by ID", async () => {
    // Assuming you have a customer with ID 1 in your database
    const req = mockRequest(
      {}, 
      {}, 
      { id: id }
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
  test("res.json called with no result for non-existent ID", async () => {
    // Assuming you don't have a customer with ID 999 in your database
    const req = mockRequest({}, {}, { id: 998 })
    const res = mockResponse()
    await base.getById(req, res)
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        status: 'success',
        code: 200,
        message: 'Success!',
        data: null
      })
    )
  })
})

describe("customers.delete function", () => {
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
  test("res.json delete a user with id 999 and return 204", async () => {
    const req = mockRequest(
      {}, 
      {}, 
      { id: id }
    )
    const res = mockResponse()
    await base.destroy(req, res)
    expect(res.status).toBeCalledWith(204)
  })
})

// kalo manual, create customer nya harus masukin authorization token
// gimana cara test response untuk internal server error