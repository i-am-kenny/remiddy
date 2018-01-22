# remiddy
[![Build Status](https://travis-ci.org/i-am-kenny/remiddy.svg?branch=master)](https://travis-ci.org/i-am-kenny/remiddy)
[![codecov](https://codecov.io/gh/i-am-kenny/remiddy/branch/master/graph/badge.svg)](https://codecov.io/gh/i-am-kenny/remiddy)

Middleware for [Remiddy](https://github.com/middyjs/middy). Inspired by the example middleware and projects like [Recompose](https://github.com/acdlite/recompose).

Better documentation is coming soon...

## Middleware
### General
- withEnvironmentVariable
- withSSM

### API
- withAwsRegion
- withFunctionVersion
- withHttpResponseHeader
- withJoiValidation
- withRequestId
- withResponseTime
- withWarmupHeader

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
