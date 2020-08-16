var greets = require('../server/protos/greet_pb')
var service = require('../server/protos/greet_grpc_pb')

var grpc = require('grpc')

/*
  Implements thegreet RPC method.
*/

function greet(call, callback) {
  var greeting = new greets.GreetResponse()
  greeting.setResult(
    "Hello " + call.request.getGreeting().getFirstName() + ' '
    + call.request.getGreeting().getLastName()
  )
  callback(null, greeting)
}

function sum(call, callback) {
  var sum = new greets.SumResponse()
  sum.setResult(
    call.request.getFirstNumber() + call.request.getSecondNumber()
  )
  callback(null, sum)
}

function main() {
  var server = new grpc.Server()
  server.addService(service.GreetServiceService, {greet: greet, sum})
  server.bind("0.0.0.0:5000", grpc.ServerCredentials.createInsecure())
  server.start()

  console.log('Server running on port 0.0.0.0:5000')
}
main()