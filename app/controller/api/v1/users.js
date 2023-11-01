const model = require("../../../model/users")

module.exports = {
  async get(req, res) {
    const { search, page, limit } = req.query

    let result = await model.get(search, page, limit)  
    
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
  async getById(req, res){
    if(isNaN(req.params.id)) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "Bad request! Id is required"
      })
    }
  
    const user = await model.getById(req.params.id)
    
    if(!user.length) {
      return res.status(404).json({
        status: "failed",
        code: 404,
        message: "User not found!"
      })
    }
  
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success!",
      data: user
    })
  },
  async create(req, res){
    const newUser = await model.create(req.body)

    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Success add new user!",
      data: newUser
    })
  },
  async update(req, res){    
    if(isNaN(req.params.id)) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "Bad request! Id is required"
      })
    }
  
    const userId = await model.getById(req.params.id)

    if(!userId.length) {
      return res.status(404).json({
        status: "failed",
        code: 404,
        message: "User not found!"
      })
    }
  
    const user = await model.update({
      ...req.body,
      id : req.params.id
    })

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Success update user!",
      data: user
    })
  },
  
  async destroy(req, res){
    if(isNaN(req.params.id)) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "Bad request! Id is required"
      })
    }
  
    await model.destroy(req.params.id)
  
    // no content
    return res.status(204).json()
  
    // // with content
    // return res.status(200).json({
    //   status: "success",
    //   code: 204,
    //   message: "Success delete user!"
    // })
  }
}
