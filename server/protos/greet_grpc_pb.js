// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var protos_greet_pb = require('../protos/greet_pb.js');

function serialize_greet_ComputeAverageRequest(arg) {
  if (!(arg instanceof protos_greet_pb.ComputeAverageRequest)) {
    throw new Error('Expected argument of type greet.ComputeAverageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_ComputeAverageRequest(buffer_arg) {
  return protos_greet_pb.ComputeAverageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_ComputeAverageResponse(arg) {
  if (!(arg instanceof protos_greet_pb.ComputeAverageResponse)) {
    throw new Error('Expected argument of type greet.ComputeAverageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_ComputeAverageResponse(buffer_arg) {
  return protos_greet_pb.ComputeAverageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_GreetManyTimesRequest(arg) {
  if (!(arg instanceof protos_greet_pb.GreetManyTimesRequest)) {
    throw new Error('Expected argument of type greet.GreetManyTimesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_GreetManyTimesRequest(buffer_arg) {
  return protos_greet_pb.GreetManyTimesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_GreetManyTimesResponse(arg) {
  if (!(arg instanceof protos_greet_pb.GreetManyTimesResponse)) {
    throw new Error('Expected argument of type greet.GreetManyTimesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_GreetManyTimesResponse(buffer_arg) {
  return protos_greet_pb.GreetManyTimesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_GreetRequest(arg) {
  if (!(arg instanceof protos_greet_pb.GreetRequest)) {
    throw new Error('Expected argument of type greet.GreetRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_GreetRequest(buffer_arg) {
  return protos_greet_pb.GreetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_GreetResponse(arg) {
  if (!(arg instanceof protos_greet_pb.GreetResponse)) {
    throw new Error('Expected argument of type greet.GreetResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_GreetResponse(buffer_arg) {
  return protos_greet_pb.GreetResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_LongGreetRequest(arg) {
  if (!(arg instanceof protos_greet_pb.LongGreetRequest)) {
    throw new Error('Expected argument of type greet.LongGreetRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_LongGreetRequest(buffer_arg) {
  return protos_greet_pb.LongGreetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_LongGreetResponse(arg) {
  if (!(arg instanceof protos_greet_pb.LongGreetResponse)) {
    throw new Error('Expected argument of type greet.LongGreetResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_LongGreetResponse(buffer_arg) {
  return protos_greet_pb.LongGreetResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_PrimeNumberRequest(arg) {
  if (!(arg instanceof protos_greet_pb.PrimeNumberRequest)) {
    throw new Error('Expected argument of type greet.PrimeNumberRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_PrimeNumberRequest(buffer_arg) {
  return protos_greet_pb.PrimeNumberRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_PrimeNumberResponse(arg) {
  if (!(arg instanceof protos_greet_pb.PrimeNumberResponse)) {
    throw new Error('Expected argument of type greet.PrimeNumberResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_PrimeNumberResponse(buffer_arg) {
  return protos_greet_pb.PrimeNumberResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_SumRequest(arg) {
  if (!(arg instanceof protos_greet_pb.SumRequest)) {
    throw new Error('Expected argument of type greet.SumRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_SumRequest(buffer_arg) {
  return protos_greet_pb.SumRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_greet_SumResponse(arg) {
  if (!(arg instanceof protos_greet_pb.SumResponse)) {
    throw new Error('Expected argument of type greet.SumResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_SumResponse(buffer_arg) {
  return protos_greet_pb.SumResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var GreetServiceService = exports.GreetServiceService = {
  // unary API
greet: {
    path: '/greet.GreetService/Greet',
    requestStream: false,
    responseStream: false,
    requestType: protos_greet_pb.GreetRequest,
    responseType: protos_greet_pb.GreetResponse,
    requestSerialize: serialize_greet_GreetRequest,
    requestDeserialize: deserialize_greet_GreetRequest,
    responseSerialize: serialize_greet_GreetResponse,
    responseDeserialize: deserialize_greet_GreetResponse,
  },
  // unary API - exercise
sum: {
    path: '/greet.GreetService/Sum',
    requestStream: false,
    responseStream: false,
    requestType: protos_greet_pb.SumRequest,
    responseType: protos_greet_pb.SumResponse,
    requestSerialize: serialize_greet_SumRequest,
    requestDeserialize: deserialize_greet_SumRequest,
    responseSerialize: serialize_greet_SumResponse,
    responseDeserialize: deserialize_greet_SumResponse,
  },
  // streaming API
greetManyTimes: {
    path: '/greet.GreetService/GreetManyTimes',
    requestStream: false,
    responseStream: true,
    requestType: protos_greet_pb.GreetManyTimesRequest,
    responseType: protos_greet_pb.GreetManyTimesResponse,
    requestSerialize: serialize_greet_GreetManyTimesRequest,
    requestDeserialize: deserialize_greet_GreetManyTimesRequest,
    responseSerialize: serialize_greet_GreetManyTimesResponse,
    responseDeserialize: deserialize_greet_GreetManyTimesResponse,
  },
  // Server streaming API - exercise
primeNumber: {
    path: '/greet.GreetService/PrimeNumber',
    requestStream: false,
    responseStream: true,
    requestType: protos_greet_pb.PrimeNumberRequest,
    responseType: protos_greet_pb.PrimeNumberResponse,
    requestSerialize: serialize_greet_PrimeNumberRequest,
    requestDeserialize: deserialize_greet_PrimeNumberRequest,
    responseSerialize: serialize_greet_PrimeNumberResponse,
    responseDeserialize: deserialize_greet_PrimeNumberResponse,
  },
  // Client Streaming API
longGreet: {
    path: '/greet.GreetService/LongGreet',
    requestStream: true,
    responseStream: false,
    requestType: protos_greet_pb.LongGreetRequest,
    responseType: protos_greet_pb.LongGreetResponse,
    requestSerialize: serialize_greet_LongGreetRequest,
    requestDeserialize: deserialize_greet_LongGreetRequest,
    responseSerialize: serialize_greet_LongGreetResponse,
    responseDeserialize: deserialize_greet_LongGreetResponse,
  },
  // Client streaming API - exercise
computeAverage: {
    path: '/greet.GreetService/ComputeAverage',
    requestStream: true,
    responseStream: false,
    requestType: protos_greet_pb.ComputeAverageRequest,
    responseType: protos_greet_pb.ComputeAverageResponse,
    requestSerialize: serialize_greet_ComputeAverageRequest,
    requestDeserialize: deserialize_greet_ComputeAverageRequest,
    responseSerialize: serialize_greet_ComputeAverageResponse,
    responseDeserialize: deserialize_greet_ComputeAverageResponse,
  },
};

exports.GreetServiceClient = grpc.makeGenericClientConstructor(GreetServiceService);
