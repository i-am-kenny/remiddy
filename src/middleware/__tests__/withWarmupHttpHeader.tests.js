import withWarmupHttpHeader from '../withWarmupHttpHeader';
import middy from 'middy';

const httpEvent = {
  httpMethod: 'GET'
};

describe('withWarmupHttpHeader', () => {
  it('should be a function', () => {
    expect(withWarmupHttpHeader).toBeInstanceOf(Function);
  });

  it('should return 204 immediately if "x-aws-warmup" header is passed', () => {
    const handler = middy((event, context, cb) => cb(null, {}))
      .use(withWarmupHttpHeader());

    const event = {
      ...httpEvent,
      headers: {
        'x-aws-warmup': ''
      }
    };

    handler(event, {}, (_, res) => {
      expect(res).toHaveProperty('statusCode', 204);
    });
  });

  it('should continue if "x-aws-warmup" header not defined', () => {
    const handler = middy((event, context, cb) => cb(null, {}))
      .use(withWarmupHttpHeader());

    handler(httpEvent, {}, (_, res) => {
      expect(res).toEqual({});
    });
  });
});