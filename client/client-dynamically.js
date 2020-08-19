const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc');

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

function main() {
  //callGreetings();
  //callGreetingExercise()
  //callGreetManyTime()
  //callGreetManyTimeExercise()
  //callLongGreeting()
  callLongGreetingExercise()
}
main()
