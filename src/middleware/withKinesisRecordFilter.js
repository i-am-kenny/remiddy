export default function(predicate) {
  return ({
    before: (handler, next) => {
      const { event } = handler;
      
      if(event.Records) {
        event.Records = event.Records.filter(predicate);
      }

      next();
    }
  })
}