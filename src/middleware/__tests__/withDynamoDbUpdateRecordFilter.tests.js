import withDynamoDbUpdateRecordFilter from '../withDynamoDbUpdateRecordFilter';
import middy from 'middy';
import dynamodb from './events/dynamodb.json';

const createHandler = () => middy((event, context, cb) => cb(null, event.Records));

describe(withDynamoDbUpdateRecordFilter, () => {
  it('should be a function', () => {
    expect(withDynamoDbUpdateRecordFilter).toBeInstanceOf(Function);
  });

  it('should filter UPDATE records', () => {
    const handler = createHandler().use(withDynamoDbUpdateRecordFilter());

    handler(dynamodb, {}, (_, records) => {
      expect(records).toHaveLength(1);
    });
  });
});