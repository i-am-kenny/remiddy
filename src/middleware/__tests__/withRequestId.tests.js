import withRequestId from '../withRequestId';
import middy from 'middy';

const createHandler = () => middy((event, context, cb) => {
  cb(null, {})
});

const httpEvent = {
  httpMethod: 'GET'
};

const context = { awsRequestId: '123' };

describe('withRequestId', () => {
  it('should be a function', () => {
    expect(withRequestId).toBeInstanceOf(Function);
  });

  it('should add awsRequestId to headers', () => {
    const handler = createHandler().use(withRequestId());

    handler(httpEvent, context, (_, res) => {
      expect(res).toHaveProperty('headers.x-aws-request-id', context.awsRequestId);
    });
  });

  it('should use header name argument', () => {
    const handler = createHandler().use(withRequestId('x-aws-request-id-2'));

    handler(httpEvent, context, (_, res) => {
      expect(res).toHaveProperty('headers.x-aws-request-id-2', context.awsRequestId);
    });
  })
});