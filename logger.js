import pino from "pino"

export default pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport: {
    targets: [
      {
        target: "pino/file",
        level: "error",
        options: { destination: "./logs/app.log", mkdir: true },
      },
      {
        target: "pino-pretty",
      },
    ],
  },
})
