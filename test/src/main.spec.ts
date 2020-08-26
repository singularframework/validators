import { should } from '../..';
import { expect } from 'chai';

describe('Validators', function() {

  it('should validate string correctly', async function() {

    let validator = should.be.a.string.and.have.length.that.is.gt(0).__exec();

    expect(await validator('some string')).to.be.true;
    expect(await validator('')).to.be.false;

  });

});
