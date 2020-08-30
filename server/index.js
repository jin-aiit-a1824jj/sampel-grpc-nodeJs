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
    console.log('The End...')
  })

  for (var i = 0; i < 10; i++){
    var greeting = new greets.Greeting()
    greeting.setFirstName('Paulo')
    greeting.setLastName('Dichone')

    var request = new greets.GreetEveryoneRequest()
    request.setGreet(greeting)

    call.write(request)
    await sleep(1000)
  }
  
}

function main() {
  var server = new grpc.Server()
  server.addService(service.GreetServiceService, 
    {
      greet: greet,
      sum: sum,
      greetManyTimes:greetManyTimes,
      primeNumber:primeNumber,
      longGreet:longGreet,
      computeAverage:computeAverage,
      greetEveryone:greetEveryone
    }
  )
  server.bind("0.0.0.0:5000", grpc.ServerCredentials.createInsecure())
  server.start()

  console.log('Server running on port 0.0.0.0:5000')
}
main()
