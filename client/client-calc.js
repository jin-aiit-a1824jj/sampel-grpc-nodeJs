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

function callPrimeNumberDecomposition() {
  var client = new calcService.CalculatorServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )

  var request = new calc.PrimeNumberDecompositionRequest()

  var number = 11 //567890

  request.setNumber(number)

  var call = client.primeNumberDecomposition(request, ()=>{})

  call.on('data', response => {
    console.log('Prime Factors Found: ', response.getPrimeFactor())
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('status', status => {
    console.log(status)
  })

  call.on('end', () => {
    console.log('Streamingg Ended!')
  })
}

function main() {
  //callSum()
  callPrimeNumberDecomposition()
}
main()
