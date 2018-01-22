import withFunctionVersion from '../withFunctionVersion';
import middy from 'middy';

const createHandler = () => middy((event, context, cb) => {
  cb(null, {})
});

const httpEvent = {
  httpMethod: 'GET'
};

const context = { functionVersion: '1' };

describe('withFunctionVersion', () => {
  it('should be a function', () => {
    expect(withFunctionVersion).toBeInstanceOf(Function);
  });

  it('should add functionVersion to headers', () => {
    const handler = createHandler().use(withFunctionVersion());

    handler(httpEvent, context, (_, res) => {
      expect(res).toHaveProperty('headers.x-function-version', context.functionVersion);
    });
  });

  it('should use header name argument', () => {
    const handler = createHandler().use(withFunctionVersion('x-function-version-2'));

    handler(httpEvent, context, (_, res) => {
      expect(res).toHaveProperty('headers.x-function-version-2', context.functionVersion);
    });
  })
});