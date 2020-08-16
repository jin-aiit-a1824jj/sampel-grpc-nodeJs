const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')

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

function main(){
  const server = new grpc.Server()
  server.addService(greetPackageDefinition.GreetService.service, {
    greet: greet, sum
  })
  server.bind("0.0.0.0:5000", grpc.ServerCredentials.createInsecure())
  server.start()
  console.log("Server Running at http://127.0.0.1:5000")
}
main()