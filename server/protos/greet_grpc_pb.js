// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var protos_greet_pb = require('../protos/greet_pb.js');

function serialize_greet_GreetManyTimesRequest(arg) {
  if (!(arg instanceof protos_greet_pb.GreetManyTimesRequest)) {
    throw new Error('Expected argument of type greet.GreetManyTimesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_GreetManyTimesRequest(buffer_arg) {
  return protos_greet_pb.GreetManyTimesRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_greet_GreetTimesRequest(arg) {
  if (!(arg instanceof protos_greet_pb.GreetTimesRequest)) {
    throw new Error('Expected argument of type greet.GreetTimesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_greet_GreetTimesRequest(buffer_arg) {
  return protos_greet_pb.GreetTimesRequest.deserializeBinary(new Uint8Array(buffer_arg));
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
    responseType: protos_greet_pb.GreetTimesRequest,
    requestSerialize: serialize_greet_GreetManyTimesRequest,
    requestDeserialize: deserialize_greet_GreetManyTimesRequest,
    responseSerialize: serialize_greet_GreetTimesRequest,
    responseDeserialize: deserialize_greet_GreetTimesRequest,
  },
};

exports.GreetServiceClient = grpc.makeGenericClientConstructor(GreetServiceService);
