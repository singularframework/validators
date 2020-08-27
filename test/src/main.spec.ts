import 'source-map-support/register';
import { should, $ } from '../..';
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

    // A boolean
    let validator = should.be.a.boolean.__exec();

    expect(await validator(true)).to.be.true;
    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(false)).to.be.true;

    // be false
    validator = should.be.a.boolean.that.is.equal(false).__exec();

    expect(await validator(true)).to.be.false;
    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(false)).to.be.true;

  });

  it('should validate numbers correctly', async function() {

    // A number
    let validator = should.be.a.number.__exec();

    expect(await validator(-123)).to.be.true;
    expect(await validator(undefined)).to.be.false;
    expect(await validator('123')).to.be.false;
    expect(await validator(true)).to.be.false;

  });

  it('should validate objects correctly', async function() {

    // An object
    let validator = should.be.an.object.__exec();

    expect(await validator([1,2,3])).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator({ a: true })).to.be.true;
    expect(await validator(true)).to.be.false;

  });

  it('should validate arrays correctly', async function() {

    // An array
    let validator = should.be.an.array.__exec();

    expect(await validator([1,2,3])).to.be.true;
    expect(await validator(null)).to.be.false;
    expect(await validator({ a: true })).to.be.false;
    expect(await validator(true)).to.be.false;

    // An array with more than 2 elements
    validator = should.be.an.array.with.length.that.is.gt(2).__exec();

    expect(await validator([1,2,3])).to.be.true;
    expect(await validator([])).to.be.false;
    expect(await validator({ a: true })).to.be.false;
    expect(await validator([1, 2])).to.be.false;
    expect(await validator(undefined)).to.be.false;
    expect(await validator(false)).to.be.false;

  });

  it('should negate next validator using "non" correctly', async function() {

    // A number between 0 (inclusive) to 50 (exclusive)
    let validator = should.be.a.number.that.is.non.lt(0).and.lt(50).__exec();

    expect(await validator(false)).to.be.false;
    expect(await validator(0)).to.be.true;
    expect(await validator(-10)).to.be.false;
    expect(await validator(50)).to.be.false;
    expect(await validator(1000)).to.be.false;
    expect(await validator(31)).to.be.true;

  });

  it('should negate all right-hand-side validators using "not" correctly', async function() {

    // A string that has length between 1 to 3
    let validator = should.be.a.string.that.does.not.have.length.gt(3).and.lt(1).__exec();

    expect(await validator('')).to.be.false;
    expect(await validator('1')).to.be.true;
    expect(await validator('abc')).to.be.true;
    expect(await validator('some long string')).to.be.false;

  });

  it('should correctly combine negating validators', async function() {

    // A string that has length less than 2
    let validator = should.be.a.string.that.has.length.non.non.gte(2).__exec();

    expect(await validator('')).to.be.true;
    expect(await validator('1')).to.be.true;
    expect(await validator('abc')).to.be.false;

    // A string that has length between 1 to 2
    validator = should.be.a.string.that.does.not.have.length.non.lte(2).and.lte(0).__exec();

    expect(await validator('')).to.be.false;
    expect(await validator('1')).to.be.true;
    expect(await validator('ab')).to.be.true;
    expect(await validator('abc')).to.be.false;

    // A string that has length between 0 to 3
    validator = should.be.a.string.that.does.not.not.have.not.not.length.gt(3).__exec();

    expect(await validator('')).to.be.true;
    expect(await validator('1')).to.be.true;
    expect(await validator('abc')).to.be.true;
    expect(await validator('abcd')).to.be.false;

  });

  it('should validate lengths correctly', async function() {

    // Its length should not be zero
    let validator = should.have.length.that.is.not.zero.__exec();

    expect(await validator(0)).to.be.true;
    expect(await validator('')).to.be.false;
    expect(await validator([])).to.be.false;
    expect(await validator('asd')).to.be.true;
    expect(await validator([1,2,3])).to.be.true;
    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;

  });

  it('should return custom error messages using "otherwise" correctly', async function() {

    const errorMessage = 'Should be a non-empty string!';

    let validator = should.be.a.non.empty.string.otherwise(errorMessage).__exec();

    expect(await validator(123)).to.have.property('message', errorMessage);
    expect(await validator('')).to.have.property('message', errorMessage);
    expect(await validator('not empty')).to.be.true;

    enum Reason {

      GeneralInquiry = 'general',
      BugReport = 'bug-report',
      FeatureRequest = 'feature-request',
      Other = 'other'

    }

    const errorMessage2 = 'Can only exist when "reason" is "other"!';
    const body1 = { reason: 'general', explanation: undefined };
    const body2 = { reason: 'other', explanation: 'The other reason...' };
    const body3 = { reason: 'bug-report', explanation: true };
    const body4 = { reason: 'other', explanation: true };

    validator = should.be.a.non.empty.string.onlyWhen(
      $('reason').does.equal(Reason.Other).otherwise(errorMessage2)
    ).otherwise(errorMessage).__exec();

    expect(await validator(body1.explanation, body1)).to.be.true;
    expect(await validator(body2.explanation, body2)).to.be.true;
    expect(await validator(body3.explanation, body3)).to.have.property('message', errorMessage2);
    expect(await validator(body4.explanation, body4)).to.have.property('message', errorMessage);

  })

});
