import withDynamoDbDeleteRecordFilter from '../withDynamoDbDeleteRecordFilter';
import middy from 'middy';
import dynamodb from './events/dynamodb.json';

const createHandler = () => middy((event, context, cb) => cb(null, event.Records));

describe(withDynamoDbDeleteRecordFilter, () => {
  it('should be a function', () => {
    expect(withDynamoDbDeleteRecordFilter).toBeInstanceOf(Function);
  });

  it('should filter REMOVE records', () => {
    const handler = createHandler().use(withDynamoDbDeleteRecordFilter());

    handler(dynamodb, {}, (_, records) => {
      expect(records).toHaveLength(1);
    });
  });
});