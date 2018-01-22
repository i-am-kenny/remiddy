import { isHttp } from '../lib/event-types';

export default function() {
  return {
    before: (handler, next) => {
      const { event } = handler;

      if(isHttp(event)) {
        event.queryStringParameters = event.queryStringParameters || {};
        event.pathParameters = event.pathParameters || {};
      }

      next();
    }
  }
}