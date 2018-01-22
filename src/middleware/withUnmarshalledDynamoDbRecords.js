import AWS from 'aws-sdk';
import { isObject } from 'lodash/fp';
import withKinesisRecordMap from './withKinesisRecordMap';

const Converter = AWS.DynamoDB.Converter;

export default function() {
  return withKinesisRecordMap((record) => {
    const { dynamodb } = record;

    if(dynamodb.Keys) {
      dynamodb.Keys = Converter.unmarshall(dynamodb.Keys);
    }

    if(dynamodb.OldImage) {
      dynamodb.OldImage = Converter.unmarshall(dynamodb.OldImage);
    }

    if(dynamodb.NewImage) {
      dynamodb.NewImage = Converter.unmarshall(dynamodb.NewImage);
    }

    return record;
  });
}