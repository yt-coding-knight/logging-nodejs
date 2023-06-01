module.exports = {
  filter(data) {
    return !!data.req
  },
  output: {
    path: "app.log", // name of file
    options: {
      path: "logs/", // path file
      size: "300B",
      interval: "5s",
      rotate: 5,
      compress: true,
    },
  },
}
