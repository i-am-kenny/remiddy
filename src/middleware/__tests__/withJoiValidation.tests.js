import withJoiValidation from '../withJoiValidation';
import middy from 'middy';
import Joi from 'joi';
import api from './events/api.json';

const createHandler = () => middy((event, context, cb) => cb(null, event));

describe('withJoiValidation', () => {
  it('should be a function', () => {
    expect(withJoiValidation).toBeInstanceOf(Function);
  });

  it('should accept Joi schemas', () => {
    const event = {
      httpMethod: 'POST'
    };
    
    const config = {
      body: Joi.object().keys().required().label('custom message')
    };

    const handler = createHandler().use(withJoiValidation(config));

    handler(event, {}, (error, res) => {
      expect(error).toHaveProperty('name', 'ValidationError');

      const message = error.details[0].message;
      expect(message).toContain('custom message');
    });
  });

  it('should throw error if body is invalid', () => {
    const event = {
      httpMethod: 'POST',
      body: {
        foo: 'hello world'
      }
    };

    const config = {
      body: {
        bar: Joi.string().required()
      }
    };

    const handler = createHandler().use(withJoiValidation(config));

    handler(event, {}, (error, res) => {
      expect(error).toHaveProperty('name', 'ValidationError');
    });
  });

  it('should parse datatypes in body', () => {
    const event = {
      httpMethod: 'POST',
      body: {
        year: '3001'
      }
    };

    const config = {
      body: {
        year: Joi.number().required()
      }
    };

    const handler = createHandler().use(withJoiValidation(config));

    handler(event, {}, (error, event) => {
      expect(event.body).toHaveProperty('year', 3001);
    });
  });
});