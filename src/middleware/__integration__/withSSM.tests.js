import withSSM from '../withSSM';
import middy from 'middy';

const PARAMETER = 'JWT_AUDIENCE';

describe('withSSM', () => {
  it('should be a function', () => {
    expect(withSSM).toBeInstanceOf(Function);
  });

  it('should add SSM variables to context.env', () => {
    const handler = middy((event, context, cb) => cb(null, context))
      .use(withSSM(PARAMETER));

    handler({}, {}, (_, context) => {
      expect(context.env).toHaveProperty(PARAMETER);
    });
  });
});