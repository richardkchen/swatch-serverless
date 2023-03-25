const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb')
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const COLOR_TABLE = process.env.COLOR_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

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
    const params = {
      TableName: COLOR_TABLE,
      ProjectionExpression: 'hex'
    }
    const response = await dynamoDbClient.send(new ScanCommand(params))

    if (response && response.$metadata.httpStatusCode == 200) {
      const resp = response.Items.map(({hex}) => hex)
      res.send(resp)
    }

  } catch (error) {
    console.log(error)
  }
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
