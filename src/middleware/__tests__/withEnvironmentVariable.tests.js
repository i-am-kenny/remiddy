import withEnvironmentVariable from '../withEnvironmentVariable';
import middy from 'middy';

const createHandler = () => middy((event, context, cb) => cb(null, context));

describe('withEnvironmentVariable', () => {
  it('should be a function', () => {
    expect(withEnvironmentVariable).toBeInstanceOf(Function);
  });

  it('should add process.env to context.env', () => {
    const handler = createHandler().use(withEnvironmentVariable());

    handler({}, {}, (_, context) => {
      expect(context.env).toHaveProperty('AWS_REGION');
      expect(context.env).toHaveProperty('NODE_ENV');
    });
  });

  it('should add some process.env to context.env', () => {
    const handler = createHandler().use(withEnvironmentVariable(['AWS_REGION']));

    handler({}, {}, (_, context) => {
      expect(context.env).toHaveProperty('AWS_REGION');
      expect(context.env).not.toHaveProperty('NODE_ENV');
    });
  });
});