import isArray from 'lodash/fp/isArray';
import withKinesisRecordFilter from './withKinesisRecordFilter';

export default function(eventNames) {
  eventNames = isArray(eventNames) ? eventNames : [eventNames];

  return withKinesisRecordFilter(r => eventNames.includes(r.eventName));
}