import difference from 'lodash/fp/difference';
import isArray from 'lodash/fp/isArray';
import AWS from 'aws-sdk';
import Cache from '../lib/cache';

const ssm = new AWS.SSM();
const cache = new Cache();


const mapSSM = ({ Name, Value }) => ({ key: Name, value: unescape(Value) });

const getFromSSM = (parameters) => {
  const options = {
    Names: isArray(parameters) ? parameters : [parameters],
    WithDecryption: true
  };

  return ssm.getParameters(options)
    .promise()
    .then(res => res.Parameters.map(mapSSM));
};

const getParameters = (parameters) => {
  const fromCache = cache.getKeys(parameters);
  const hits = fromCache.filter(c => c.miss === false);
  const misses = fromCache.filter(c => c.miss === true).map(c => c.key);

  if(!misses || misses.length === 0) {
    return Promise.resolve(hits);
  }
  
  return getFromSSM(misses)
    .then(misses => {
      cache.setKeys(misses);

      return misses;
    })
    .then(misses => misses.concat(hits));
}


export default function(parameters, region = process.env.AWS_REGION) {
  AWS.config.update({ region: region });

  return {
    before: (handler, next) => {
      const { context } = handler;
      
      return getParameters(parameters)
        .then((parameters) => {
          context.env = context.env || {};

          parameters.forEach(p => {
            context.env[p.key] = p.value;
          });
        });
    }
  }
}