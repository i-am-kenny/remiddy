import { isHttp } from '../lib/event-types';
import withHttpResponseHeaders from './withHttpResponseHeaders';

const region = process.env.AWS_REGION;

export default function(header = 'x-aws-region') {
  return withHttpResponseHeaders({
    [header]: region
  });
}