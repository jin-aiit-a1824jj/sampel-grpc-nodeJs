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

function callComputeAverage(){
  var client = new calcService.CalculatorServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )

  var request = new calc.ComputeAverageRequest()

  var call = client.computeAverage(request, (error, response) => {
    if(!error){
      console.log('Received a response from the server - Average: ' + response.getAverage())
    } else {
      console.error(error)
    }
  })

  // var requestOne = new calc.ComputeAverageRequest()
  // requestOne.setNumber(1)  

  // var requestTwo = new calc.ComputeAverageRequest()
  // requestTwo.setNumber(2)  

  // var requestThree = new calc.ComputeAverageRequest()
  // requestThree.setNumber(3)  

  // var requestFour = new calc.ComputeAverageRequest()
  // requestFour.setNumber(4)  

  // call.write(requestOne)
  // call.write(requestTwo)
  // call.write(requestThree)
  // call.write(requestFour)

  for (var i = 0; i < 1000000; i++){
      var request = new calc.ComputeAverageRequest()
      request.setNumber(i)
      call.write(request) 
  }

  call.end() // we are done sending messages
}

async function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), interval)
  })
}

async function callBiDifindMaximum() {
  var client = new calcService.CalculatorServiceClient(
    '127.0.0.1:5000',
    grpc.credentials.createInsecure()
  )

  var request = new calc.FindMaximumRequest()
  var call = client.findMaximum(request, (error, response)=>{})
  
  call.on('data', request => {
    console.log('Got new Max from Server => ', request.getMaximum());
  })

  call.on('error', error => {
    console.error(error)
  })

  call.on('end', () => {
    console.log('Server is Completed sending messages')
  }) 

  // data
  let data = [3, 5, 17, 9, 8, 30, 12, 345, 129, 0]
  for(var i = 0; i < data.length; i++) {
    var request = new calc.FindMaximumRequest()
    console.log('Sending number: ' + data[i])
    request.setNumber(data[i])
    call.write(request)
    await sleep(1000)
  }

  call.end() // we are done sending messages
}

function main() {
  //callSum()
  //callPrimeNumberDecomposition()
  //callComputeAverage()
  callBiDifindMaximum()
}
main()
