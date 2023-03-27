const { BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb')
const { ddbClient } = require('../utils/ddbClient')

const batchWriteItems = async ({ tableName, items }) => {
  try {
    const BATCH_SIZE = 25
    const putRequests = items.map((hex) => {
      const id = Math.floor(Math.random() * 16777215)
      return {
        PutRequest: {
          Item: {
            id: { N: `${id}` },
            hex: { S: hex },
          },
        },
      }
    })

    const params = {
      RequestItems: {
        [`${tableName}`]: putRequests,
      },
    }

    if (items.length <= BATCH_SIZE) {
      const response = await ddbClient.send(new BatchWriteItemCommand(params))
      if (response && response.$metadata.httpStatusCode == 200) {
        const { requestId } = response
        console.log('success', JSON.stringify(response))
        return { requestId }
      }

    } else {

      const batchList = batchItems(items, BATCH_SIZE)
      const awaitAddItems = batchList.map(
        async batch => await batchWriteItems({ tableName, items: batch })
      )
      const response = await Promise.all([...awaitAddItems])
      const success = response.every(({$metadata}) => $metadata && $metadata.httpStatusCode === 200)
      if (response && success) {

        const mapped = response.map(({ requestId }) => requestId)
        console.log('success', JSON.stringify(response))
        return mapped
      }

    }
  } catch (err) {
    console.log('error', err)
  }
}

const batchItems = (items, batchSize) => {
  return items.reduce((list, item, index) => {
    const batchNum = Math.floor(index / batchSize)
    if (!list[batchNum]) {
      list.push([item])
    } else {
      list[batchNum] = [...list[batchNum], item]
    }
    return list
  }, [])
}

module.exports = {
  batchWriteItems,
}