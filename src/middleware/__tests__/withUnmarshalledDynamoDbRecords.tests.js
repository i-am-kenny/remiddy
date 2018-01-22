import withUnmarshalledDynamoDbRecords from '../withUnmarshalledDynamoDbRecords';
import middy from 'middy';
import { cloneDeep } from 'lodash/fp';
import dynamodb from './events/dynamodb.json';

const createHandler = () => middy((event, context, cb) => cb(null, event.Records));

describe(withUnmarshalledDynamoDbRecords, () => {
  it('should be a function', () => {
    expect(withUnmarshalledDynamoDbRecords).toBeInstanceOf(Function);
  });

  it('should unmarshal Keys & NewImage records', () => {
    const handler = createHandler().use(withUnmarshalledDynamoDbRecords());

    handler(cloneDeep(dynamodb), {}, (_, records) => {
      const [first] = records;

      expect(first.dynamodb.Keys).toEqual({ Id: 101 });
      expect(first.dynamodb.NewImage).toEqual({ Message: 'New item!', Id: 101 });
    });
  });

  it('should unmarshal Keys, NewImage, & OldImage records', () => {
    const handler = createHandler().use(withUnmarshalledDynamoDbRecords());

    handler(cloneDeep(dynamodb), {}, (_, records) => {
      const [,second] = records;

      expect(second.dynamodb.Keys).toEqual({ Id: 101 });
      expect(second.dynamodb.NewImage).toEqual({ Message: 'This item has changed', Id: 101 });
      expect(second.dynamodb.OldImage).toEqual({ Message: 'New item!', Id: 101 });
    });
  });
});