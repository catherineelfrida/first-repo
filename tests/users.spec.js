// unit testing
const  base = require('../app/controllerl/users')
const mockRequest = ( body = {}, query = {}, params = {} ) =>
                    ({ body, query, params })
                    
const mockResponse = () => {
  const res = {}
  res.json = jest.fn().mockReturnValue(res)
  res.status = jest.fn().mockReturnValue(res)
  return res
}
// get user test
describe("users.get function", () => {
  test("res.json called with users data", async () => {
    const req = mockRequest()
    const res = mockResponse()
    await base.get(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        code: 200,
        message: "Success!",
        data: expect.any(Array)
      })
    )
  })
})