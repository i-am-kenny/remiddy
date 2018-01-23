import withKinesisRecordMap from './withKinesisRecordMap';

const getTableNameFromStreamArn = (arn) => arn.split('/')[1];

export default function(prop = 'tableName') {
  return withKinesisRecordMap(record => Object.assign(
    {},
    record,
    { 
      [prop]: getTableNameFromStreamArn(record.eventSourceARN)
    }
  ));
}