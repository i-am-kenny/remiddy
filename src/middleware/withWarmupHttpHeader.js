export default function(header = 'x-aws-warmup') {
  return {
    before: (handler, next) => {
      const { event } = handler;

      if(event && event.headers) {
        const value = event.headers[header];

        if(value !== null && value !== undefined) {
          return handler.callback(null, { statusCode: 204 });
        }
      }

      return next();
    }
  }
}