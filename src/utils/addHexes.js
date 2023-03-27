const { batchWriteItems } = require('../repository/batchWriteItems')

const addHexes = async ({ tableName }) => {
  try {
    const NUM = 225
    const randomHex = () => Math.floor(Math.random() * 16777215).toString(16)
    const array = [...Array(NUM).keys()].map((i) => `#${randomHex()}`)

    const response = await batchWriteItems({ tableName, items: array })
    return response

  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  addHexes,
}
