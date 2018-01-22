import { isHttp } from '../lib/event-types';
import withHttpResponseHeaders from './withHttpResponseHeaders';

export default function(header = 'x-aws-response-time') {
  const withHeader = withHttpResponseHeaders((handler) => ({
    [header]: (handler.context._responseTime - Date.now()).toString()
  }));

  return ({
    before: (handler, next) => {
      handler.context._responseTime = Date.now();

      next();
    },
    after: withHeader.after
  });
}