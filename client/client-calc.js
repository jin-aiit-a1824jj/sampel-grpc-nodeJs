var calc = require('../server/protos/calculator_pb')
var calcService = require('../server/protos/calculator_grpc_pb')

var grpc = require('grpc')

function callSum() {
  var client = new calcService.CalculatorServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )

  var sumRequest = new calc.SumRequest()

  sumRequest.setFirstNumber(10)
  sumRequest.setSecondNumber(15)
  
  client.sum(sumRequest, (error, response) => {
    if(!error){
      console.log(sumRequest.getFirstNumber() + " + " + sumRequest.getSecondNumber() + " = " + response.getSumResult() )
    }else {
      console.error(error)
    }
  })
}

function main() {
  callSum()
}
main()
