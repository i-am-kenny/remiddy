import withHttpResponseHeaders from './withHttpResponseHeaders';

export default function(header = 'x-aws-request-id') {
  return withHttpResponseHeaders((handler) => ({
    [header]: handler.context.awsRequestId
  }))
}