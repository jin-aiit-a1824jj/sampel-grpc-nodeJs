const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc');
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

const client = new greetPackageDefinition.GreetService("127.0.0.1:5000", grpc.credentials.createInsecure())

const client_SSL = new greetPackageDefinition.GreetService("localhost:5000", 
  grpc.credentials.createSsl(
    fs.readFileSync(path.join(__dirname, '../certs/ca.crt')),
    fs.readFileSync(path.join(__dirname, '../certs/client.key')),
    fs.readFileSync(path.join(__dirname, '../certs/client.crt'))
  )
)

function callGreetings() {

  var request = {
    greeting: {
      first_name: "Jerry",
      second_name: "Tom"
    }
  }

  client.greet(request, (error, response) => {
    if(!error) {
      console.log("Greeting Response: ", response.result);
    }else {
      console.error(error)
    }
  })
}

function callGreetingExercise(){
  
  var request = {
    first_number: 3,
    second_number: 10
  }

  client.sum(request, (error, response)=>{
    if(!error){
      console.log("Sum Response: ", response.result )
    } else {
      console.error(error)
    }
  })
}

function callGreetManyTime() {

  var request = {
    greeting: {
      first_name: "Jerry",
      second_name: "Tom"
    }
  }

  var call = client.greetManyTimes(request, () => {})

  call.on('data', (response) => {
    console.log('Client Streaming Response: ', response.result)
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
  // create request & set the Greeting
  var request = {
    number: 120
  }
  
  var call = client.primeNumber(request, () => {})
  
  call.on('data', (response) => {
    console.log('Client Streaming Response: ', response.result)
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

function callLongGreeting(){

  var request = {
    greet: {
      first_name: "Jerry",
      last_name: "Tom"
    }
  }

  var call = client.longGreet(request, (error, response) => {
    if(!error){
      console.log('Server Response: ', response.result)
    }else {
      console.error(error)
    }
  })

  let count = 0, intervalID = setInterval(function(){
    
    console.log('Sending message ' + count)

    call.write(request)
    if(++count > 3){
      clearInterval(intervalID)
      call.end() // we have sent all the message
    }
  }, 1000)
}

function callLongGreetingExercise(){

  var request = {
    number: 0,
  }
  
  var call = client.computeAverage(request, (error, response) => {
    if(!error){
        console.log('Server Response: ', response.result)
    }else {
        console.error(error)
    }
  })

  let numbers = [1, 2, 3, 4]
  numbers.forEach(function(item, _, _) {
    var request = {
      number: item,
    }
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

  var request = {
    greet: {
      first_name: "Stephane",
      last_name: "Maarke"
    }
  }

  var call = client.greetEveryone(request, (error, response) => {
    if(!error){
        console.log('Server Response: ', response.result)
    }else {
        console.error(error)
    }
  })

  call.on('data', response => {
    console.log('Hello Client! '+ response.result)
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('end', () => {
    console.log('Client The End')
  })

  for(var i = 0; i < 10; i++) {
    call.write(request)
    await sleep(1000)
  }

  call.end()

}

async function callBiDirectExercise() {
  var request = {
    number: 0
  }

  var call = client.findMaximum(request, (error, response) => {
    if(!error){
        console.log('Server Response: ', response.result)
    }else {
        console.error(error)
    }
  })

  call.on('data', response => {
    console.log('FindMaximum => '+ response.result)
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('end', () => {
    console.log('Client The End')
  })

  let array = [1,5,3,6,2,20]
  for(var i = 0; i < array.length; i++){
    request.number = array[i];
    console.log('Sending number: ' + array[i])
    call.write(request)
    await sleep(1000)
  }

  call.end()

}

function doErrorCall() {
  console.log("Hello From Client - doErrorCall")
 
  var number = -1// * -25
  var squareRootRequest = {number: number}

  client.squareRoot(squareRootRequest, (error, response) => {
    if(!error){
      console.log('Square root is ', response.number_root)
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
 
  var deadline = {deadline: getRPCDeadLine(1)}

  var number = -1// * -25
  var squareRootRequest = {number: number}

  client.squareRoot(squareRootRequest, deadline, (error, response) => {
    if(!error){
      console.log('Square root is ', response.number_root)
    } else {
      //console.error(error)
      console.log(error.code)
      console.log(error.message)
    }
  })

}

function callGreeting_SSL() {
  console.log("Hello From Client - callGreeting_SSL")

  var request = {
    greeting: {
      first_name: "Jerry",
      second_name: "Tom"
    }
  }

  client_SSL.greet(request, (error, response) => {
    if(!error) {
      console.log("Greeting Response: ", response.result);
    }else {
      console.error(error)
    }
  })
}

function main() {
  //callGreetings();
  //callGreetingExercise()
  //callGreetManyTime()
  //callGreetManyTimeExercise()
  //callLongGreeting()
  //callLongGreetingExercise()
  //callBiDirect()
  //callBiDirectExercise()
  //doErrorCall()
  //doErrorCall_deadline()
  callGreeting_SSL() // nodeの実行位置確認！
}
main()
