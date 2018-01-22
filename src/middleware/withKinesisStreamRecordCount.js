export default function() {
  return ({
    before: (handler, next) => {
      const { event } = handler;
      
      if(event.Records && event.Records.length >= 0) {
        console.log(`processing ${event.Records.length} records`);
      }

      next();
    }
  })
}