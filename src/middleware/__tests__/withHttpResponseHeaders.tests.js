import { isFunction } from 'lodash/fp';
import withHttpResponseHeaders from '../withHttpResponseHeaders';
import middy from 'middy';

const createHandler = () => middy((event, context, cb) => {
  cb(null, {});
});

const httpEvent = {
  httpMethod: 'GET'
};

describe('withHttpResponseHeaders', () => {
  it('should be a function', () => {
    expect(withHttpResponseHeaders).toBeInstanceOf(Function);
  });

  it('should accept headers config', () => {
    const handler = createHandler().use(withHttpResponseHeaders({
      'Content-Type': 'application/json'
    }));

    handler(httpEvent, {}, (_, res) => {
      expect(res).toHaveProperty('headers.Content-Type', 'application/json');
    });
  });

  it('should invoke config if it is a function', () => {
    const config = jest.fn();

    const handler = createHandler().use(withHttpResponseHeaders(config));

    handler(httpEvent, {}, (_, res) => {
      expect(config).toHaveBeenCalled();      
    });
  });

  it('should add headers in the event of an error', () => {
    const handler = middy((event, context, cb) => {
      throw new Error();
    });

    handler.use(withHttpResponseHeaders({
      'Content-Type': 'application/json'
    }));

    handler(httpEvent, {}, (_, res) => {
      expect(res).toHaveProperty('headers.Content-Type', 'application/json');
    });
  });
});