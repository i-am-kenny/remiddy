import Joi from 'joi';
import { isHttp } from '../lib/event-types';
import createError from 'http-errors';

const defaultJoiOptions = {
  convert: true
};

const validate = (content, schema, options) => {
  const { error, value } = Joi.validate(content, schema, options);

  if(error && error.isJoi) {
    throw error;
  }

  return value;
}

export default function(config, joiOptions) {
  const schemas = Object.keys(config);

  joiOptions = Object.assign({}, defaultJoiOptions, joiOptions);

  return {
    before: (handler, next) => {
      const { event } = handler;

      if(!isHttp(event)) {
        return next();
      }

      schemas.forEach(name => {
        event[name] = validate(event[name], config[name], joiOptions);
      });

      next();
    }
  };
}