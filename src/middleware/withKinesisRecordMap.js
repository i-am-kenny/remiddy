export default function(mapper) {
  return ({
    before: (handler, next) => {
      const { event } = handler;
      
      if(event.Records) {
        event.Records = event.Records.map(mapper);
      }

      next();
    }
  })
}