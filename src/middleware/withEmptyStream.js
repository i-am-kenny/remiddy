export default function() {
  return {
    before: (handler, next) => {
      const { event } = handler;

      if(event.Records && event.Records.length === 0) {
        console.log('No records to process');

        return handler.callback();
      }

      return next();
    }
  }
}