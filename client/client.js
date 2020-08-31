var greets = require('../server/protos/greet_pb')
var service = require('../server/protos/greet_grpc_pb')

const fs = require('fs')

var grpc = require('grpc')

let credentials = grpc.credentials.createSsl(
  fs.readFileSync('../certs/ca.crt'),
  fs.readFileSync('../certs/client.key'),
  fs.readFileSync('../certs/client.crt')
)

let unsafeCred = grpc.credentials.createInsecure()

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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function callLongGreetingExercise() {
  console.log("Hello From Client - callcallLongGreetingExercise")

  // Create our server client
  var client = new service.GreetServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )

  var request = new greets.ComputeAverageRequest()
  
  var call = client.computeAverage(request, (error, response) => {
    if(!error){
        console.log('Server Response: ', response.getResult())
    }else {
        console.error(error)
    }
  })

  let numbers = [];//[1, 2, 3, 4]
  for (var i = 0; i < 4; i++){
    numbers.push(getRandomInt(0, 100))
  }
  numbers.forEach(function(item, _, _) {
    var request = new greets.ComputeAverageRequest()
    request.setNumber(item)
    call.write(request)
  })
  call.end()
  
}

async function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), interval)
  })
}

async function callBiDirect() {
  console.log("Hello From Client - callBiDirect")

  // Create our server client
  var client = new service.GreetServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )

  var call = client.greetEveryone(request, (error, response) => {
    console.log('Server Response: ' + response)
  })

  call.on('data', response => {
    console.log('Hello Client! '+ response.getResult())
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('end', () => {
    console.log('Client The End')
  })

  for(var i = 0; i < 10; i++) {
    var greeting = new greets.Greeting()
    greeting.setFirstName('Stephane')
    greeting.setLastName('Maarke')

    var request = new greets.GreetEveryoneRequest()
    request.setGreet(greeting)
    call.write(request)
    await sleep(1000)
  }

  call.end()
}

async function callBiDirectExercise() {
  console.log("Hello From Client - callBiDirectExercise")

  // Create our server client
  var client = new service.GreetServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )

  var request = new greets.FindMaximumRequest()

  var call = client.findMaximum(request, (error, response) => {
    console.log('Server Response: ' + response)
  })

  call.on('data', response => {
    console.log('FindMaximum => '+ response.getResult())
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('end', () => {
    console.log('Client The End')
  })

  let array = [1,5,3,6,2,20]
  array.forEach(async (item, index, array) => {
    var request = new greets.FindMaximumRequest()
    request.setNumber(item)
    call.write(request)
    await sleep(1500)
  })

  call.end()
}

function doErrorCall() {
  console.log("Hello From Client - doErrorCall")

  var client = new service.GreetServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )
 
  var number = -1// * -25
  var squareRootRequest = new greets.SquareRootRequest()
  squareRootRequest.setNumber(number)

  client.squareRoot(squareRootRequest, (error, response) => {
    if(!error){
      console.log('Square root is ', response.getNumberRoot())
    } else {
      //console.error(error)
      console.log(error.code)
      console.log(error.message)
    }
  })

}

function getRPCDeadLine(rpcType) {
  var timeAllowed = 5000

  switch(rpcType){
    case 1:
      timeAllowed = 10//1000
      break
    
    case 2:
      timeAllowed = 7000
      break
    
    default :
      console.log('Invalid RPC Type: Using Default Timeout')
  }

  return new Date(Date.now() + timeAllowed)
}

function doErrorCall_deadline() {
  console.log("Hello From Client - doErrorCall_deadline")

  var deadline = getRPCDeadLine(1)

  var client = new service.GreetServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )
 
  var number = -1// * -25
  var squareRootRequest = new greets.SquareRootRequest()
  squareRootRequest.setNumber(number)

  client.squareRoot(squareRootRequest, { deadline: deadline }, (error, response) => {
    if(!error){
      console.log('Square root is ', response.getNumberRoot())
    } else {
      //console.error(error)
      console.log(error.code)
      console.log(error.message)
    }
  })
}

function callGreeting_SSL() {
  console.log("Hello From Client - callGreeting")

  var client = new service.GreetServiceClient(
    'localhost:5000',
    credentials
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


function main() {
  //callGreeting()
  //callGreetingExercise()
  //callGreetManyTime()
  //callGreetManyTimeExercise()
  //callLongGreeting()
  //callLongGreetingExercise()
  //callBiDirect()
  //callBiDirectExercise()
  //doErrorCall()
  //doErrorCall_deadline()
  callGreeting_SSL() 
}
main()
