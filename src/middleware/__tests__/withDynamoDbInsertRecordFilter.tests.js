import withDynamoDbInsertRecordFilter from '../withDynamoDbInsertRecordFilter';
import middy from 'middy';
import dynamodb from './events/dynamodb.json';

const createHandler = () => middy((event, context, cb) => cb(null, event.Records));

describe(withDynamoDbInsertRecordFilter, () => {
  it('should be a function', () => {
    expect(withDynamoDbInsertRecordFilter).toBeInstanceOf(Function);
  });

  it('should filter INSERT records', () => {
    const handler = createHandler().use(withDynamoDbInsertRecordFilter());

    handler(dynamodb, {}, (_, records) => {
      expect(records).toHaveLength(1);
    });
  });
});