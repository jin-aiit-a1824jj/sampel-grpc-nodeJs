var grpc = require('grpc')

function main() {
  var server = new grpc.Server()
  
  server.bind("0.0.0.0:5000", grpc.ServerCredentials.createInsecure())
  server.start()

  console.log('Server running on port 0.0.0.0:5000')
}
main()