const { ScanCommand } = require('@aws-sdk/lib-dynamodb')
const { ddbClient } = require('../utils/ddbClient')

const scanTable = async ({ tableName }) => {
  try {
    const params = {
      TableName: tableName,
      ProjectionExpression: 'hex',
    }
    const response = await ddbClient.send(new ScanCommand(params))

    if (response && response.$metadata.httpStatusCode == 200) {
      const resp = response.Items.map(({ hex }) => hex)
      return resp
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  scanTable,
}
