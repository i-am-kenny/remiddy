import withKinesisRecordMap from '../withKinesisRecordMap';
import middy from 'middy';
import kinesis from './events/kinesis.json';

const createHandler = () => middy((event, context, cb) => cb(null, event.Records));

describe('withKinesisRecordMap', () => {
  it('should be a function', () => {
    expect(withKinesisRecordMap).toBeInstanceOf(Function);
  });

  it('should call map function', () => {
    const fn = jest.fn().mockReturnValue(true);
    const handler = createHandler().use(withKinesisRecordMap(fn));

    handler(kinesis, {}, (_, res) => {
      expect(fn).toHaveBeenCalled();      
    });
  });

  it('should map Records by mapper', () => {
    const fn = record => true;

    const handler = createHandler().use(withKinesisRecordMap(fn));

    handler(kinesis, {}, (_, records) => {
      expect(records).toEqual([true, true]);
    });
  });
});