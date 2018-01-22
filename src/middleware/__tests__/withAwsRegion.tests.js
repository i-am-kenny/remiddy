import withAwsRegion from '../withAwsRegion';
import middy from 'middy';

const createHandler = () => middy((event, context, cb) => {
  cb(null, {})
});

const httpEvent = {
  httpMethod: 'GET'
};

describe('withAwsRegion', () => {
  it('should be a function', () => {
    expect(withAwsRegion).toBeInstanceOf(Function);
  });

  it('should add region to headers', () => {
    const handler = createHandler().use(withAwsRegion());

    handler(httpEvent, {}, (_, res) => {
      expect(res).toHaveProperty('headers.x-aws-region', process.env.AWS_REGION);
    });
  });

  it('should use header name argument', () => {
    const handler = createHandler().use(withAwsRegion('x-aws-region-2'));

    handler(httpEvent, {}, (_, res) => {
      expect(res).toHaveProperty('headers.x-aws-region-2', process.env.AWS_REGION);
    });
  })
});