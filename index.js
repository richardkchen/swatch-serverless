const express = require("express")
const serverless = require("serverless-http")
const { scanTable } = require('./src/repository/scanTable')
const { addHexes } = require('./src/utils/addHexes')

const app = express()

const tableName = process.env.COLOR_TABLE

app.use(express.json())

app.get("/colors", async (req, res) => {
  
  const colors = [
    'Red',
    'Orange',
    'Yellow',
    'Green',
    'Blue',
    'Purple',
    'Brown',
    'Gray',
  ]
  res.send(colors)
})

app.get("/hexes", async (req, res) => {
  try {
    const hexes = await scanTable({ tableName })
    res.send(hexes)
  } catch (error) {
    console.log(error)
  }
})

app.post('/addhexes', async (req, res) => {
  try {
    const resp = await addHexes({ tableName })
    res.send(resp)
  } catch (error) {
    console.log(error)
  }
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  })
})


module.exports.handler = serverless(app)
