var calc = require('../server/protos/calculator_pb')
var calcService = require('../server/protos/calculator_grpc_pb')

var grpc = require('grpc')

//CalculatorService sum
function sum(call, callback) {
  var sumResponse = new calc.SumResponse()
  sumResponse.setSumResult(
    call.request.getFirstNumber() + call.request.getSecondNumber()
  )
  callback(null, sumResponse)
}

function main() {
  var server = new grpc.Server()
  server.addService(calcService.CalculatorServiceService, {sum: sum})
  server.bind("0.0.0.0:5000", grpc.ServerCredentials.createInsecure())
  server.start()

  console.log('Server running on port 0.0.0.0:5000')
}
main()