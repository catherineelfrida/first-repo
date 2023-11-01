const pool = require('../../config/db')

module.exports = {
  async get(search = null, page = 1, limit = 10){
    const searchs = search ? `%${search}%` : null
    
    const result = await pool.query(
      `SELECT * FROM nasabah
       WHERE 
          ($1::text is null or nama ilike $1 or alamat ilike $1)
       LIMIT $2
       OFFSET $3`,
      [searchs, limit, (page - 1) * limit]
    )

    return result.rows
  },
  async getById(id){
    const result = await pool.query(
      `SELECT * FROM nasabah WHERE id = $1`, [id]
    )
    return result.rows
  },
  async create ({nama, alamat}){
      const result = await pool.query(
        `INSERT INTO nasabah (nama, alamat)
        values ($1,$2)
        RETURNING *`,
        [nama, alamat]
      )
      return result.rows[0]
  },
  async update ({id, nama, alamat}){
    const result = await pool.query(
      `UPDATE nasabah
       SET 
          nama = $2,
          alamat = $3
       WHERE id = $1
       RETURNING *`,
      [id, nama, alamat]
    )
    return result.rows[0]
  },
  async destroy (id){
    const result = await pool.query(
      `DELETE FROM nasabah
      WHERE id = $1`,
      [id]
    )
    return result.rows
  }
}
