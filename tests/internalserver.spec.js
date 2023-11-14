// unit testing
const { PrismaClient } = require('@prisma/client')
const base = require('../app/controller/api/v1/customers')

const prismadb = new PrismaClient()

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

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}))

const id2 = 997
describe("customers.create function", () => {
  test("res.status called with 500 for internal server error", async () => {
    const req = mockRequest({
      id: id2,
      nama: "test2",
      alamat: "Jl. Test",
      email: "test1@gmail.com",
      password: "1234"
    })
    
    const res = mockResponse()

    const createMock = jest.fn()

    // membuat fake error
    createMock.mockImplementation(() => {
      throw new Error('There was an error');
    })

    prismadb.customer = { create: createMock }
    
    try { await base.create(req, res)
    // console.log(res.json.mock.calls[0][0])
    expect(res.status).toBeCalledWith(500)
    expect(res.json).toBeCalledWith({ error: 'Terjadi kesalahan server.' })
    } catch (error) {
    }
  })
})