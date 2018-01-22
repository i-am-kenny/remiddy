'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fp = require('lodash/fp');
var Joi = _interopDefault(require('joi'));
var httpErrors = _interopDefault(require('http-errors'));
var AWS = _interopDefault(require('aws-sdk'));

const getEventSource = fp.get('Records[0].eventSource');





function isHttp(event) {
  return event && event.hasOwnProperty('httpMethod');
}

const withAwsRegion = (headers) => {
  const addHeaders = (handler, next) => {
    if(isHttp(handler.event)) {
      handler.response = handler.response || {};

      const newHeaders = fp.isFunction(headers) ? headers(handler) : headers;

      handler.response.headers = Object.assign({}, newHeaders, handler.response.headers);
    }

    next();
  };

  return {
    after: addHeaders,
    onError: addHeaders
  };
};

const region = process.env.AWS_REGION;

function withAwsRegion$1(header = 'x-aws-region') {
  return withAwsRegion({
    [header]: region
  });
}

function withKinesisRecordFilter(predicate) {
  return ({
    before: (handler, next) => {
      const { event } = handler;
      
      if(event.Records) {
        event.Records = event.Records.filter(predicate);
      }

      next();
    }
  })
}

function withDynamoDbRecordFilter(eventNames) {
  eventNames = fp.isArray(eventNames) ? eventNames : [eventNames];

  return withKinesisRecordFilter(r => eventNames.includes(r.eventName));
}

function withDynamoDbDeleteRecordFilter() {
  return withDynamoDbRecordFilter('REMOVE');
}

function withDynamoDbInsertRecordFilter() {
  return withDynamoDbRecordFilter('INSERT');
}

function withDynamoDbUpdateRecordFilter() {
  return withDynamoDbRecordFilter('MODIFY');
}

function withDynamoDbUpsertRecordFilter() {
  return withDynamoDbRecordFilter(['INSERT', 'MODIFY']);
}

function withEnvironmentVariable(variables) {
  return {
    before: (handler, next) => {
      const { context } = handler;

      const env = variables 
        ? fp.pick(variables, process.env) 
        : process.env;

      context.env = Object.assign({}, context.env, env);
      
      next();
    }
  }
}

function withFunctionVersion(header = 'x-function-version') {
  return withAwsRegion((handler) => ({
    [header]: handler.context.functionVersion
  }))
}

const defaultJoiOptions = {
  convert: true
};

const validate = (content, schema, options) => {
  const { error, value } = Joi.validate(content, schema, options);

  if(error && error.isJoi) {
    throw error;
  }

  return value;
};

function withJoiValidation(config, joiOptions) {
  const schemas = Object.keys(config);

  joiOptions = Object.assign({}, defaultJoiOptions, joiOptions);

  return {
    before: (handler, next) => {
      const { event } = handler;

      if(!isHttp(event)) {
        return next();
      }

      schemas.forEach(name => {
        event[name] = validate(event[name], config[name], joiOptions);
      });

      next();
    }
  };
}

function withKinesisRecordMap(mapper) {
  return ({
    before: (handler, next) => {
      const { event } = handler;
      
      if(event.Records) {
        event.Records = event.Records.map(mapper);
      }

      next();
    }
  })
}

function withKinesisStreamRecordCount() {
  return ({
    before: (handler, next) => {
      const { event } = handler;
      
      if(event.Records && event.Records.length >= 0) {
        console.log(`processing ${event.Records.length} records`);
      }

      next();
    }
  })
}

function withRequestId(header = 'x-request-id') {
  return withAwsRegion((handler) => ({
    [header]: handler.context.awsRequestId
  }))
}

function withResponseTime(header = 'x-response-time') {
  const withHeader = withAwsRegion((handler) => ({
    [header]: (handler.context._responseTime - Date.now()).toString()
  }));

  return ({
    before: (handler, next) => {
      handler.context._responseTime = { start: Date.now() };

      next();
    },
    after: withHeader.after
  });
}

class Cache {
  constructor() {
    this.cache = {};
    this.ttl = 10 * 60 * 1000;
  }

  getKey(key) {
    const obj = this.cache[key];

    if(fp.isNil(obj) || obj._expires > Date.now()) {
      return { key, miss: true };
    }

    return { key, value: obj.value };
  }

  getKeys(keys) {
    keys = fp.isArray(keys) ? keys : [keys];

    return keys.map(this.getKey.bind(this));
  }

  setKey(key, value, ttl) {
    const _expires = Date.now() + (ttl || this.ttl);

    this.cache[key] = {
      value,
      _expires
    };
  }

  setKeys(pairs, ttl) {
    pairs.forEach(({ key, value }) => this.setKey(key, value, ttl));
  }
}

const ssm = new AWS.SSM();
const cache = new Cache();


const mapSSM = ({ Name, Value }) => ({ key: Name, value: unescape(Value) });

const getFromSSM = (parameters) => {
  const options = {
    Names: fp.isArray(parameters) ? parameters : [parameters],
    WithDecryption: true
  };

  return ssm.getParameters(options)
    .promise()
    .then(res => res.Parameters.map(mapSSM));
};

const getParameters = (parameters) => {
  const fromCache = cache.getKeys(parameters);
  const hits = fromCache.filter(c => c.miss === false);
  const misses = fromCache.filter(c => c.miss === true).map(c => c.key);

  if(!misses || misses.length === 0) {
    return Promise.resolve(hits);
  }
  
  return getFromSSM(misses)
    .then(misses => {
      cache.setKeys(misses);

      return misses;
    })
    .then(misses => misses.concat(hits));
};


function withSSM(parameters, region = process.env.AWS_REGION) {
  AWS.config.update({ region: region });

  return {
    before: (handler, next) => {
      const { context } = handler;
      
      return getParameters(parameters)
        .then((parameters) => {
          context.env = context.env || {};

          parameters.forEach(p => {
            context.env[p.key] = p.value;
          });
        });
    }
  }
}

const Converter = AWS.DynamoDB.Converter;

function withUnmarshalledDynamoDbRecords() {
  return withKinesisRecordMap((record) => {
    const { dynamodb } = record;

    if(dynamodb.Keys) {
      dynamodb.Keys = Converter.unmarshall(dynamodb.Keys);
    }

    if(dynamodb.OldImage) {
      dynamodb.OldImage = Converter.unmarshall(dynamodb.OldImage);
    }

    if(dynamodb.NewImage) {
      dynamodb.NewImage = Converter.unmarshall(dynamodb.NewImage);
    }

    return record;
  });
}

function withWarmupHttpHeader(header = 'x-aws-warmup') {
  return {
    before: (handler, next) => {
      const { event } = handler;

      if(event && event.headers) {
        const value = event.headers[header];

        if(value !== null && value !== undefined) {
          return handler.callback(null, { statusCode: 204 });
        }
      }

      return next();
    }
  }
}

exports.withAwsRegion = withAwsRegion$1;
exports.withDynamoDbDeleteRecordFilter = withDynamoDbDeleteRecordFilter;
exports.withDynamoDbInsertRecordFilter = withDynamoDbInsertRecordFilter;
exports.withDynamoDbRecordFilter = withDynamoDbRecordFilter;
exports.withDynamoDbUpdateRecordFilter = withDynamoDbUpdateRecordFilter;
exports.withDynamoDbUpsertRecordFilter = withDynamoDbUpsertRecordFilter;
exports.withEnvironmentVariable = withEnvironmentVariable;
exports.withFunctionVersion = withFunctionVersion;
exports.withHttpResponseHeaders = withAwsRegion;
exports.withJoiValidation = withJoiValidation;
exports.withKinesisRecordFilter = withKinesisRecordFilter;
exports.withKinesisRecordMap = withKinesisRecordMap;
exports.withKinesisStreamRecordCount = withKinesisStreamRecordCount;
exports.withRequestId = withRequestId;
exports.withResponseTime = withResponseTime;
exports.withSSM = withSSM;
exports.withUnmarshalledDynamoDbRecords = withUnmarshalledDynamoDbRecords;
exports.withWarmupHttpHeader = withWarmupHttpHeader;
