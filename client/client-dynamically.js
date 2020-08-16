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

function main() {
  callGreetings();
  callGreetingExercise()
}
main()