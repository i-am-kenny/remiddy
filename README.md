# remiddy
[![Build Status](https://travis-ci.org/i-am-kenny/remiddy.svg?branch=master)](https://travis-ci.org/i-am-kenny/remiddy)
[![codecov](https://codecov.io/gh/i-am-kenny/remiddy/branch/master/graph/badge.svg)](https://codecov.io/gh/i-am-kenny/remiddy)
[![Known Vulnerabilities](https://snyk.io/test/github/i-am-kenny/remiddy/badge.svg?targetFile=package.json)](https://snyk.io/test/github/i-am-kenny/remiddy?targetFile=package.json)

Middleware for [Remiddy](https://github.com/middyjs/middy). Inspired by the example middleware and projects like [Recompose](https://github.com/acdlite/recompose).

Better documentation is coming soon...

## Middleware
### General
- withEnvironmentVariable
- withSSM

### API
- [withAwsRegion](#withawsregion)
- [withFunctionVersion](#withfunctionversion)
- [withHttpResponseHeader](#withhttpresponseheader)
- withJoiValidation
- [withRequestId](#withrequestid)
- [withResponseTime](#withresponsetime)
- [withWarmupHeader](#withwarmupheader)

### Kinesis
- withKinesisRecordFilter
- withKinesisRecordMap
- withKinesisStreamRecordCount

### DynamoDb Stream
- withDynamoDbDeleteRecordFilter
- withDynamoDbInsertRecordFilter
- withDynamoDbRecordFilter
- withDynamoDbUpdateRecordFilter
- withDynamodbUpsertRecordFilter
- withUnmarshalledDynamoDbRecords

## Examples
### withAwsRegion
Adds the `context.invokedFunctionArn` to the response headers as `x-aws-region`.
```javascript
middy(...).use(withAwsRegion());
middy(...).use(withAwsRegion('x-aws-region')); // optionally rename the header
```

### withFunctionVersion
Adds the Lambda function version to the response headers as `x-aws-function-version`.
```javascript
middy(...).use(withFunctionVersion());
middy(...).use(withFunctionVersion('x-aws-function-version')); // optionally rename the header
```

### withHttpResponseHeader
Adds custom HTTP repsonse headers.
```javascript
middy(...).use(withResponseHeader({
  'Access-Control-Allow-Origin': '*'
}));

middy(...).use(withResponseHeader((handler) => ({
  'x-custom-header': handler.event.value
})));
```

### withRequestId
Adds the `context.awsRequestId` to the response headers as `x-aws-request-id`.
```javascript
middy(...).use(withRequestId());
middy(...).use(withRequestId('x-aws-request-id')); // optionally rename the header
```

### withResponseTime
Adds "response-time" (ms) to the response headers as `x-aws-response-time`. Does not include the coldstart time, and is likely not accurate.
```javascript
middy(...).use(withResponseTime());
middy(...).use(withResponseTime('x-aws-response-time')); // optionally rename the header
```

### withWarmupHeader
Allows `x-aws-warmup` to be passed via request headers to immediately end execution with a `204` status.
```javascript
middy(...).use(withWarmupHeader());
middy(...).use(withWarmupHeader('x-aws-warmup')); // optionally rename the header
```
