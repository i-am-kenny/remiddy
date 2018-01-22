import { isHttp } from '../lib/event-types';
import withHttpResponseHeaders from './withHttpResponseHeaders';

export default function(header = 'x-aws-region') {
  return withHttpResponseHeaders((handler) => {
    const region = handler.context.invokedFunctionArn.split(':')[3];

    return {
      [header]: region
    }
  });
}