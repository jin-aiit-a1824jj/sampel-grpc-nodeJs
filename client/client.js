var greets = require('../server/protos/greet_pb')
var service = require('../server/protos/greet_grpc_pb')

var grpc = require('grpc')

function callGreeting() {
  console.log("Hello From Client - callGreeting")

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

function callGreetingExercise(){
  console.log("Hello From Client - callGreetingExercise")

  var client = new service.GreetServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )
  
  // Excercise SUM API
  var request2 = new greets.SumRequest()
  request2.setFirstNumber(3)
  request2.setSecondNumber(10)
  client.sum(request2, (error, response)=>{
    if(!error){
      console.log("Sum Response: ", response.getResult() )
    } else {
      console.error(error)
    }
  })
}

function main() {
  callGreeting()
  callGreetingExercise()
}
main()