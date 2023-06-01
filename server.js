import express from "express"
import pinoHttp from "pino-http"
import connectDb, { getDb } from "./db.js"
import logger from "./logger.js"

const app = express()
app.use(pinoHttp({ logger }))

function pagination(nameCollection) {
  return async (req, res, next) => {
    const limit = +req.query.limit
    const page = +req.query.page
    const result = {}

    const skip = (page - 1) * limit

    const db = getDb()
    const collection = db.collection(nameCollection)
    const count = await collection.estimatedDocumentCount()

    result.first = {
      page: 1,
      limit,
    }

    if (limit * page < count) {
      result.next = {
        page: page + 1,
        limit,
      }
    }

    if (page > 1) {
      result.prev = {
        page: page - 1,
        limit,
      }
    }

    result.last = {
      page: Math.ceil(count / limit),
      limit,
    }

    try {
      throw new Error("this is error")
      result.result = await collection.find().limit(limit).skip(skip).toArray()
      req.result = result
      next()
    } catch (error) {
      req.log.error(error, "request error")
      res.status(500).json(error.message)
    }
  }
}

app.get("/products", pagination("products"), (req, res) => {
  const result = req.result

  res.status(200).json(result)
})

app.listen(3000, () => {
  logger.info("server running")
  connectDb()
})
