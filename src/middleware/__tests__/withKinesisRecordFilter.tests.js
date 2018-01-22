import withKinesisRecordFilter from '../withKinesisRecordFilter';
import middy from 'middy';
import kinesis from './events/kinesis.json';

const createHandler = () => middy((event, context, cb) => cb(null, event.Records));

describe('withKinesisRecordFilter', () => {
  it('should be a function', () => {
    expect(withKinesisRecordFilter).toBeInstanceOf(Function);
  });

  it('should call filter function', () => {
    const fn = jest.fn().mockReturnValue(true);
    const handler = createHandler().use(withKinesisRecordFilter(fn));

    handler(kinesis, {}, (_, res) => {
      expect(fn).toHaveBeenCalled();      
    });
  });

  it('should filter Records by predicate', () => {
    const fn = record => record.eventVersion === '1.0';

    const handler = createHandler().use(withKinesisRecordFilter(fn));

    handler(kinesis, {}, (_, records) => {
      expect(records).toHaveLength(1);
    });
  });
});