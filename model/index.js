const {Sequelize, DataTypes} = require('sequelize') // Format: commonJS module
const dbConfig = require('../config/dbConfig') // Import the database configuration from dbConfig.js

// la sequelize yo config haru lag ani databse connect gardyae vaneko ho
const sequelize = new Sequelize(dbConfig.db, dbConfig.username, dbConfig.password, { // database name, username bydefault:root, password bydefault: empty string
    host: dbConfig.host,  // database host 
    port: dbConfig.port,        // database port bydefault: 3306
    dialect: dbConfig.dialect,  // database dialect bydefault: mysql
    logging: false,
    pool: { 
        max: 5, // Maximum number of connection in pool
        min: 0, // Minimum number of connection in pool
        acquire: 30000, // Maximum time (in milliseconds) that pool will try to get connection before throwing error
        idle: 10000 // Maximum time (in milliseconds) that a connection can be idle before being released
    }
})

sequelize.authenticate() // Authenticate the connection to the database
    .then(() => {
        console.log('Database connection has been established successfully.') // Log a success message if the connection is successful
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err) // Log an error message if the connection fails
    })

    const db = {} // Create an empty object to hold the models
    db.Sequelize = Sequelize // Add Sequelize class to the db object  
    db.sequelize = sequelize // Add sequelize  to the db object
     
    // importing model files
    db.users = require('./userModel')(sequelize, DataTypes) 
    db.questions = require('./questionModel')(sequelize, DataTypes)
    db.answers = require('./answerModel')(sequelize,DataTypes)
    
    // Define associations between models
    db.users.hasMany(db.questions)
    db.questions.belongsTo(db.users)
    
    // Define associations between users and answers
    db.questions.hasMany(db.answers)
    db.answers.belongsTo(db.questions)

    db.users.hasMany(db.answers)
    db.answers.belongsTo(db.users)


    db.sequelize.sync({force: false }).then(() => { // Sync the database with the models
        console.log('Synced done!!') // Log a message indicating that the database has been synced
    })
 
module.exports = db // Export the db object so that it can be used in other files



// module.exports = haha // Format: commonJS module
// export default haha // Format: ecmaScript module




