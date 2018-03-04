import { Serializer } from '../TP_webApp/TP_webApp/app/controller/Serializer';
import * as assert from 'assert';

describe('Serializer Test', () => {
  describe('Deserialize Test', () => {
    it('should return -1 when the value is not present', () => {      
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

