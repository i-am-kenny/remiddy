import withDynamoDbUpsertRecordFilter from '../withDynamoDbUpsertRecordFilter';
import middy from 'middy';
import dynamodb from './events/dynamodb.json';

const createHandler = () => middy((event, context, cb) => cb(null, event.Records));

describe(withDynamoDbUpsertRecordFilter, () => {
  it('should be a function', () => {
    expect(withDynamoDbUpsertRecordFilter).toBeInstanceOf(Function);
  });

  it('should filter INSERT & MODIFY records', () => {
    const handler = createHandler().use(withDynamoDbUpsertRecordFilter());

    handler(dynamodb, {}, (_, records) => {
      expect(records).toHaveLength(2);
    });
  });
});