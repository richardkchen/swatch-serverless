const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({
  region: process.env.region
})
const dynamoDbClient = DynamoDBDocumentClient.from(client)
const ddbClient = dynamoDbClient

module.exports = {
  dynamoDbClient,
  ddbClient,
}
