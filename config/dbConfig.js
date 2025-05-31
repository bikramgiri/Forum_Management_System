const dbConfig = {
  host: process.env.HOST,
  username: process.env.DB_USERNAME,
  password: process.env.PASSWORD,
  db: process.env.DB,
  port: 3306,  // localhost port 
  // port: 21946,   // production 
  dialect: 'mysql'
}

module.exports = dbConfig // Export the databaseConfig object so that it can be used in other files