var greets = require('../server/protos/greet_pb')
var service = require('../server/protos/greet_grpc_pb')

var grpc = require('grpc')

function main() {

  console.log("Hello From Client")

  var client = new service.GreetServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )
  
  // create our request
  var request = new greets.GreetRequest()
  
  // created a protocol buffer greeting message
  var greeting = new greets.Greeting()
  greeting.setFirstName("Jerry")
  greeting.setLastName("Tom")

  // set the Greeting
  request.setGreeting(greeting)

  client.greet(request, (error, response)=> {
    if(!error){
      console.log("Greeting Response: ", response.getResult() )
    } else {
      console.error(error)
    }
  })
}
main()