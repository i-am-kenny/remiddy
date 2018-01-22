import isFunction from 'lodash/fp/isFunction';
import { isHttp } from '../lib/event-types';

const withAwsRegion = (headers) => {
  const addHeaders = (handler, next) => {
    if(isHttp(handler.event)) {
      handler.response = handler.response || {};

      const newHeaders = isFunction(headers) ? headers(handler) : headers;

      handler.response.headers = Object.assign({}, newHeaders, handler.response.headers);
    }

    next();
  };

  return {
    after: addHeaders,
    onError: addHeaders
  };
};

export default withAwsRegion