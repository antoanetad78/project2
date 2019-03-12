const express = require('express')
const app = express()
const Sequelize = require('sequelize')
// const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres', {define: { timestamps: false }})
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize(connectionString, {define: { timestamps: false }})
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const House = sequelize.define('house', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    size: Sequelize.INTEGER,
    price: Sequelize.INTEGER
  }, {
    tableName: 'houses'
  })
  
  House.sync() // this creates the houses table in your database when your app starts

  app.get('/houses', function (req, res, next) {
    House.findAll().then(houses => {
      res.json({ houses: houses })
    }).catch(err => {
        res.status(500).json({
          message: 'Something went wrong',
          error: err
        })
      })
  })

  app.get('/houses/:id', function(req, res, next){
      const id = req.params.id
      House.findById(id).then(house => {
          res.json({houses:house})
      }).catch(err => {
          res.status
      })
  })



//   House.create({
//     title: 'Multi Million Estate',
//     description: 'This was build by a super-duper rich programmer',
//     size: 1235,
//     price: 98400000
//   }).then(house => console.log(`The house is now created. The ID = ${house.id}`))
//     .catch(err=>{
//         res.status(500).json({
//             message: 'Something went wrong',
//             error: err
//           })
//   })

  app.post('/houses', function (req, res) {
    House
      .create(req.body)
      .then(house => res.status(201).json(house))  
  })

  app.put('/houses/:id', function (req, res) {
    const id = req.params.id

    House
        .findById(id)
        .then(
            house => {
                house.update({
                    ...req.body
                    // title: req.body.title,
                    // description:req.body.description
                })
            }
        )
        .then(house => res.status(201).json(house))
        .then(house => console.log(`The house with ID ${house.id} is now updated`, house))
        .catch(error => console.log('there is an error:', error))
    
  })

  app.delete('/houses/:id', function (req, res) {
      const id = req.params.id

      House
        .findById(id)
        .then(house => house.destroy())
        .then(result => res.status(200)
            .json({
                    messsage: `House ${id} was deleted successfuly`,
                    result
            })
        )
        .catch(err => console.log('there was an error', err))

  })



  const port = 4000
  app.listen(port, () => `Listening on port ${port}`)