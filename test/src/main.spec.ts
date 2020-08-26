import { should } from '../..';
import { expect } from 'chai';

describe('Validators', function() {

  it('should validate strings correctly', async function() {

    // String and length greater than zero
    let validator = should.be.a.string.and.have.length.that.is.gt(0).__exec();

    expect(await validator('some string')).to.be.true;
    expect(await validator('')).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(false)).to.be.false;

    // String and not empty and length not equal to zero
    validator = should.be.a.string.that.is.not.empty.where.its.length.does.not.equal(0).__exec();

    expect(await validator('some string')).to.be.true;
    expect(await validator('')).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(false)).to.be.false;

    // Empty and string
    validator = should.be.an.empty.string.__exec();

    expect(await validator('some string')).to.be.false;
    expect(await validator('')).to.be.true;
    expect(await validator(null)).to.be.false;
    expect(await validator(false)).to.be.false;

    // Not a string
    validator = should.not.be.a.string.__exec();

    expect(await validator('some string')).to.be.false;
    expect(await validator('')).to.be.false;
    expect(await validator(123)).to.be.true;
    expect(await validator(false)).to.be.true;

    // Not empty but a string
    validator = should.be.a.non.empty.string.__exec();

    expect(await validator('some string')).to.be.true;
    expect(await validator('')).to.be.false;
    expect(await validator(123)).to.be.false;
    expect(await validator(false)).to.be.false;

    // Not empty and not string
    validator = should.not.be.an.empty.string.__exec();

    expect(await validator('some string')).to.be.false;
    expect(await validator('')).to.be.false;
    expect(await validator(123)).to.be.true;
    expect(await validator(false)).to.be.true;

  });

});
