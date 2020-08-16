var grpc = require('grpc')
var services = require('../server/protos/dummy_grpc_pb')

function main() {

  console.log("Hello From Client")

  var client = new services.DummyServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )
  
  // we do stuff
  console.log("client", client)
  
}
main()