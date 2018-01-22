import { pick } from 'lodash/fp';

export default function(variables) {
  return {
    before: (handler, next) => {
      const { context } = handler;

      const env = variables 
        ? pick(variables, process.env) 
        : process.env;

      context.env = Object.assign({}, context.env, env);
      
      next();
    }
  }
};
