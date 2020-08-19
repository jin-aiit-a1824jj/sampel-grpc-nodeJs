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

//primeFactor -
function primeNumberDecomposition(call, callback){
  var number = call.request.getNumber()
  var divisor = 2

  console.log("Received number:  ", number);

  while (number > 1) {
    if (number % divisor === 0){
      var primeNumberDecompositionResponse = new calc.PrimeNumberDecompositionResponse()
      primeNumberDecompositionResponse.setPrimeFactor(divisor)
      number = number / divisor

      //write the message using call.write()
      call.write(primeNumberDecompositionResponse)
    } else {
      divisor++
      console.log('Divisor has increased to', divisor);
    }
  }

  call.end() // all messages sent! we are done
}

function computeAverage(call, callback) {
  
  // running sum and count
  var sum = 0
  var count = 0

  call.on('data', request => {
    // increment sum
    sum += request.getNumber();
    
    console.log("Got Number: " + request.getNumber())

    // increment count
    count += 1
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('end', ()=>{
    // compute the actual average
    var average = sum / count

    var response = new calc.ComputeAverageResponse()
    response.setAverage(average)
    callback(null, response)
  })
}

function main() {
  var server = new grpc.Server()
  server.addService(calcService.CalculatorServiceService,
     {
       sum: sum,
       primeNumberDecomposition: primeNumberDecomposition,
       computeAverage: computeAverage,
      }
  )
  server.bind("0.0.0.0:5000", grpc.ServerCredentials.createInsecure())
  server.start()

  console.log('Server running on port 0.0.0.0:5000')
}
main()
