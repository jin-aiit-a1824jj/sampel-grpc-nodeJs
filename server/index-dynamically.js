const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')
const fs = require('fs')
//grpc service definition for greet

const greetProtoPath = path.join(__dirname, "..", "protos", "greet.proto")
const greetProtoDefinition = protoLoader.loadSync(greetProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const greetPackageDefinition = grpc.loadPackageDefinition(greetProtoDefinition).greet

function greet(call, callback){
  var firstName = call.request.greeting.first_name;
  var lastName = call.request.greeting.last_name;

  callback(null, {result: "Hello " + firstName + " " + lastName})
}

function sum(call, callback) {
  callback(null, {result: call.request.first_number + call.request.second_number})
}

function greetManyTimes(call, callback) {
  var firstName = call.request.greeting.first_name;
  
  let count = 0, intervalID = setInterval(function(){
    var greetManyTimesResponse = { result: "Hello " + firstName }
    
    // setup streaming
    call.write(greetManyTimesResponse)
    if(++count > 9){
      clearInterval(intervalID)
      call.end() // we have sent all message!
    }  
  }, 500)
}

function primeNumber(call, callback){
  var number = call.request.number;
  var k = 2

  while(number > 1){
    if (number % k == 0){
      
      var primeNumberResponse = { result: k }
      call.write(primeNumberResponse)

      number /= k
    } else {
      k += 1
    }
  }

  call.end()
}

function longGreet(call, callback) {
 call.on('data', request => {
    var fullName = request.greet.first_name + " " + request.greet.last_name
    console.log(fullName)
 })

 call.on('error', error => {
   console.error(error)
 })

 call.on('end', ()=>{
   var response = { "result" : 'Long Greet Client Streaming......'}
   callback(null, response)
 })
}

function computeAverage(call, callback) {

  var list = []

  call.on('data', request => {
    list.push(request.number)
    console.log(list.length + "->" + request.number)
 })

 call.on('error', error => {
   console.error(error)
 })

 call.on('end', ()=>{
   
   const result = list.reduce(function(prev, current, index, array){
     return prev + current
   })/list.length;

   var response = {
     "result" : result
   }
   callback(null, response)
 })

}

async function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), interval)
  })
}

async function greetEveryone(call, callback) {
  call.on('data', request => {
    var fullName = request.greet.first_name  + ' ' + request.greet.last_name
    console. log('Hello ' + fullName)
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('end', () => {
    console.log('Server The End...')
  })

  for (var i = 0; i < 10; i++){
    var response = { result: 'Paulo Dichone' }
    call.write(response)
    await sleep(1000)
  }

  call.end()
}

async function findMaximum(call, callback) {

  var maxNumber = 0;

  call.on('data', response => {
    var requestNumber = response.number
    console.log('Request number: ' + requestNumber)

    if(requestNumber > maxNumber){
      maxNumber = requestNumber;

      var request = { result: maxNumber }
      call.write(request)
    }
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
  var number = call.request.number

  if (number >= 0){
    var numberRoot = Math.sqrt(number)
    var response = {number_root: numberRoot}
  
    callback(null, response)
  } else {
    // Error handling
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: 'The number being sent is not positive ' + 'Number sent: ' + number
    })
  }

}

let credentials = grpc.ServerCredentials.createSsl(
  fs.readFileSync('../certs/ca.crt'),
  [{
    cert_chain: fs.readFileSync('../certs/server.crt'),
    private_key:fs.readFileSync('../certs/server.key')
  }],
  true
)// nodeの実行位置確認！

let unsafeCred = grpc.credentials.createInsecure()

function main(){
  const server = new grpc.Server()
  server.addService(greetPackageDefinition.GreetService.service, {
    greet: greet,
    sum:sum,
    greetManyTimes:greetManyTimes,
    primeNumber:primeNumber,
    longGreet:longGreet,
    computeAverage:computeAverage,
    greetEveryone:greetEveryone,
    findMaximum:findMaximum,
    squareRoot:squareRoot

  })
  server.bind("0.0.0.0:5000", credentials)
  server.start()
  console.log("Server Running at http://127.0.0.1:5000")
}
main()
