import withHttpResponseHeaders from './withHttpResponseHeaders';

export default function(header = 'x-function-version') {
  return withHttpResponseHeaders((handler) => ({
    [header]: handler.context.functionVersion
  }))
}