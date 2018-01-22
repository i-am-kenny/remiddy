import { get } from 'lodash/fp';

const getEventSource = get('Records[0].eventSource');

export function isDynamoDb(event) {
  return getEventSource(event) === 'aws:dynamodb';  
}

export function isFirehose(event)  {
  return event.deliveryStreamArn === 'aws:lambda:events';
}

export function isHttp(event) {
  return event && event.hasOwnProperty('httpMethod');
}

export function isKinesis(event) {
  return getEventSource(event) === 'aws:kinesis';
}

export function isS3(event) {
  return getEventSource(event) === 'aws:s3';
}

export function isScheduled(event) {
  return event.source === 'aws.events';
}