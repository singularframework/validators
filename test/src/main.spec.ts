import 'source-map-support/register';
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

  it('should validate booleans correctly', async function() {

    let validator = should.be.a.boolean.__exec();

    expect(await validator(true)).to.be.true;
    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(false)).to.be.true;

    validator = should.be.a.boolean.that.is.equal(false).__exec();

    expect(await validator(true)).to.be.false;
    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(false)).to.be.true;

  });

  it('should validate numbers correctly', async function() {

    let validator = should.be.a.number.__exec();

    expect(await validator(-123)).to.be.true;
    expect(await validator(undefined)).to.be.false;
    expect(await validator('123')).to.be.false;
    expect(await validator(true)).to.be.false;

  });

  it('should validate objects correctly', async function() {

    let validator = should.be.an.object.__exec();

    expect(await validator([1,2,3])).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator({ a: true })).to.be.true;
    expect(await validator(true)).to.be.false;

  });

});
