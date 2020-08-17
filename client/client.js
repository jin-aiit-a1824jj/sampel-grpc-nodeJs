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

function callGreetManyTime() {
  var client = new service.GreetServiceClient(
    'localhost:5000',
    grpc.credentials.createInsecure()
  )

  // create request
  var request = new greets.GreetManyTimesRequest()
  var greeting = new greets.Greeting()
  greeting.setFirstName('Paulo')
  greeting.setLastName('Dichone')

  // set the Greeting
  request.setGreeting(greeting)
  
  var call = client.greetManyTimes(request, () => {})
  
  call.on('data', (response) => {
    console.log('Client Streaming Response: ', response.getResult())
  })

  call.on('status', (status)=> {
    console.log("status:->");
    console.log(status);
    console.log(status.details);
  })

  call.on('error', (error) => {
    console.log("error:->");
    console.error(error);
    console.error(error.details);
  })

  call.on('end', () => {
    console.log('Streaming Ended!')
  })
}

function callGreetManyTimeExercise() {
  var client = new service.GreetServiceClient(
    'localhost:5000',
    grpc.credentials.createInsecure()
  )

  // create request
  var request = new greets.PrimeNumberRequest()

  // set the Greeting
  request.setNumber(120)
  
  var call = client.primeNumber(request, () => {})
  
  call.on('data', (response) => {
    console.log('Client Streaming Response: ', response.getResult())
  })

  call.on('status', (status)=> {
    console.log("status:->");
    console.log(status);
    console.log(status.details);
  })

  call.on('error', (error) => {
    console.log("error:->");
    console.error(error);
    console.error(error.details);
  })

  call.on('end', () => {
    console.log('Streaming Ended!')
  })
}

function callLongGreeting() {
  console.log("Hello From Client - callGreeting")

  // Create our server client
  var client = new service.GreetServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )

  var request = new greets.LongGreetRequest()
  
  var call = client.longGreet(request, (error, response) => {
    if(!error){
        console.log('Server Response: ', response.getResult())
    }else {
        console.error(error)
    }
  })

  let count = 0, intervalID = setInterval(function(){
    console.log('Sending message ' + count)

    var request = new greets.LongGreetRequest()
    var greeting = new greets.Greeting()
    greeting.setFirstName("Paule")
    greeting.setLastName("Dichone")

    request.setGreet(greeting)

    call.write(request)

    var requestTwo = new greets.LongGreetRequest()
    var greetingTwo = new greets.Greeting()
    greetingTwo.setFirstName("Stephane")
    greetingTwo.setLastName("Marrek")

    requestTwo.setGreet(greetingTwo)

    call.write(requestTwo)

    if(++count > 3){
      clearInterval(intervalID)
      call.end() // we have sent all the message
    }
  }, 1000)

}

function main() {
  //callGreeting()
  //callGreetingExercise()
  //callGreetManyTime()
  //callGreetManyTimeExercise()
  callLongGreeting()
}
main()
