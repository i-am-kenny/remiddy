import withAwsRegion from '../withAwsRegion';
import middy from 'middy';
import api from './events/api.json';

const createHandler = () => middy((event, context, cb) => {
  cb(null, {})
});

const context = {
  invokedFunctionArn: 'arn:aws:lambda:us-west-2:1111111111:function:functionName'
};

describe('withAwsRegion', () => {
  it('should be a function', () => {
    expect(withAwsRegion).toBeInstanceOf(Function);
  });

  it('should add region to headers', () => {
    const handler = createHandler().use(withAwsRegion());

    handler(api, context, (_, res) => {
      expect(res).toHaveProperty('headers.x-aws-region', 'us-west-2');
    });
  });

  it('should use header name argument', () => {
    const handler = createHandler().use(withAwsRegion('x-aws-region-2'));

    handler(api, context, (_, res) => {
      expect(res).toHaveProperty('headers.x-aws-region-2', 'us-west-2');
    });
  })
});