var greets = require('../server/protos/greet_pb')
var service = require('../server/protos/greet_grpc_pb')

const fs = require('fs')
const path = require('path')
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

function primeNumber(call, callback) {
  console.log("Hello From server - primeNumber")
  
  var number = call.request.getNumber()
  var k = 2

  while(number > 1){
    if (number % k == 0){
      
      var primeNumberResponse = new greets.PrimeNumberResponse()
      primeNumberResponse.setResult(k)
      call.write(primeNumberResponse)

      number /= k
    } else {
      k += 1
    }
  }

  call.end()
}

function longGreet(call, callback) {
  console.log("Hello From server - longGreet")

  call.on('data', request => {
     var fullName = request.getGreet().getFirstName() + " " + request.getGreet().getLastName()
     console.log("Hello " + fullName)
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('end', ()=>{
    var response = new greets.LongGreetResponse()
    response.setResult('Long Greet Client Streaming......')
    callback(null, response)
  })
}

function computeAverage(call, callback) {
  console.log("Hello From server - computeAverage")

  var list = []
  var counter = 0;
  call.on('data', request => {
    const number = request.getNumber();
    console.log(counter++ + "->" + number)
    list.push(number)
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('end', ()=>{
    var response = new greets.ComputeAverageResponse()
    const result = list.reduce(function(prev, current, index, array){
      return prev + current
    })/list.length;

    response.setResult(result)
    callback(null, response)
  })
}

async function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), interval)
  })
}

async function greetEveryone(call, callback) {
  call.on('data', response => {
    var fullName = response.getGreet().getFirstName() + ' ' + response.getGreet().getLastName()
    console. log('Hello ' + fullName)
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('end', () => {
    console.log('Server The End...')
  })

  for (var i = 0; i < 10; i++){
    var greeting = new greets.Greeting()
    greeting.setFirstName('Paulo')
    greeting.setLastName('Dichone')

    var request = new greets.GreetEveryoneResponse()
    request.setResult(greeting.toString())

    call.write(request)
    await sleep(1000)
  }
  
  call.end()
}

async function findMaximum(call, callback) {
  
  var maxNumber = 0;

  call.on('data', response => {
    var requestNumber = response.getNumber()
    console. log('Request number: ' + requestNumber)

    if(requestNumber > maxNumber)
      maxNumber = requestNumber;

    var request = new greets.FindMaximumResponse()
    request.setResult(maxNumber)

    call.write(request)
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('end', () => {
    console.log('Server The End...')
    call.end()
  })

}

function squareRoot(call, callback) {
  var number = call.request.getNumber()

  if (number >= 0){
    var numberRoot = Math.sqrt(number)
    var response = new greets.SquareRootResponse()
    response.setNumberRoot(numberRoot)

    callback(null, response)
  } else {
    // Error handling
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: 'The number being sent is not positive ' + 'Number sent: ' + number
    })
  }

}

function main() {

  let credentials = grpc.ServerCredentials.createSsl(
    fs.readFileSync(path.join(__dirname, '../certs/ca.crt')),
    [{
      cert_chain: fs.readFileSync(path.join(__dirname, '../certs/server.crt')),
      private_key:fs.readFileSync(path.join(__dirname, '../certs/server.key'))
    }],
    true
  )

  let unsafeCred = grpc.ServerCredentials.createInsecure()

  var server = new grpc.Server()
  server.addService(service.GreetServiceService, 
    {
      greet: greet,
      sum: sum,
      greetManyTimes:greetManyTimes,
      primeNumber:primeNumber,
      longGreet:longGreet,
      computeAverage:computeAverage,
      greetEveryone:greetEveryone,
      findMaximum:findMaximum,
      squareRoot:squareRoot
    }
  )
  server.bind("0.0.0.0:5000", credentials)
  server.start()

  console.log('Server running on port 0.0.0.0:5000')
}
main()
