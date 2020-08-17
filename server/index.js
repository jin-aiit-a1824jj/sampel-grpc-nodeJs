var greets = require('../server/protos/greet_pb')
var service = require('../server/protos/greet_grpc_pb')

var grpc = require('grpc')

/*
  Implements the greet RPC method.
*/

function greet(call, callback) {
  console.log("Hello From server - greet")
  var greeting = new greets.GreetResponse()
  greeting.setResult(
    "Hello " + call.request.getGreeting().getFirstName() + ' '
    + call.request.getGreeting().getLastName()
  )
  callback(null, greeting)
}

function sum(call, callback) {
  console.log("Hello From server - sum")
  var sum = new greets.SumResponse()
  sum.setResult(
    call.request.getFirstNumber() + call.request.getSecondNumber()
  )
  callback(null, sum)
}

function greetManyTimes(call, callback) {
  console.log("Hello From server - greetManyTimes")

  var firstName = call.request.getGreeting().getFirstName()
  
  let count = 0, intervalID = setInterval(function(){
    var greetManyTimesResponse = new greets.GreetManyTimesResponse()
    greetManyTimesResponse.setResult(firstName)
    
    // setup streaming
    call.write(greetManyTimesResponse)
    if(++count > 9){
      clearInterval(intervalID)
      call.end() // we have sent all message!
    }  
  }, 1000)

}

function main() {
  var server = new grpc.Server()
  server.addService(service.GreetServiceService, 
    {
      greet: greet,
      sum: sum,
      greetManyTimes:greetManyTimes
    }
  )
  server.bind("0.0.0.0:5000", grpc.ServerCredentials.createInsecure())
  server.start()

  console.log('Server running on port 0.0.0.0:5000')
}
main()
