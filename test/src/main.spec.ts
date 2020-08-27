import 'source-map-support/register';
import { should, that, $ } from '../..';
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

    // Should be a non-empty string when "reason" is "other", otherwise should be undefined
    validator = should.be.a.non.empty.string.onlyWhen(
      $('reason').does.equal(Reason.Other).otherwise(errorMessage2)
    ).otherwise(errorMessage).__exec();

    expect(await validator(body1.explanation, body1)).to.be.true;
    expect(await validator(body2.explanation, body2)).to.be.true;
    expect(await validator(body3.explanation, body3)).to.have.property('message', errorMessage2);
    expect(await validator(body4.explanation, body4)).to.have.property('message', errorMessage);

  });

  it('should validate undefined correctly', async function() {

    let validator = should.be.undefined.__exec();

    expect(await validator(undefined)).to.be.true;
    expect(await validator(null)).to.be.false;
    expect(await validator('')).to.be.false;
    expect(await validator(123)).to.be.false;

  });

  it('should validate null correctly', async function() {

    let validator = should.be.null.__exec();

    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.true;
    expect(await validator('')).to.be.false;
    expect(await validator({})).to.be.false;

  });

  it('should validate NaN correctly', async function() {

    let validator = should.be.NaN.__exec();

    expect(await validator(NaN)).to.be.equal(isNaN(NaN));
    expect(await validator(null)).to.be.equal(isNaN(null));
    expect(await validator(0)).to.be.equal(isNaN(0));
    expect(await validator(123)).to.be.equal(isNaN(123));
    expect(await validator(-2)).to.be.equal(isNaN(-2));
    expect(await validator({})).to.be.equal(isNaN(<any>{}));
    expect(await validator([])).to.be.equal(isNaN(<any>[]));
    expect(await validator(parseInt('blah'))).to.be.equal(isNaN(parseInt('blah')));

  });

  it('should validate true correctly', async function() {

    let validator = should.be.true.__exec();

    expect(await validator(undefined)).to.be.false;
    expect(await validator(true)).to.be.true;
    expect(await validator('')).to.be.false;
    expect(await validator(false)).to.be.false;
    expect(await validator(123)).to.be.false;
    expect(await validator(123 % 2 === 1)).to.be.true;

  });

  it('should validate false correctly', async function() {

    let validator = should.be.false.__exec();

    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator('')).to.be.false;
    expect(await validator(false)).to.be.true;
    expect(await validator(<unknown>123 === 0)).to.be.true;

  });

  it('should validate truthy values correctly', async function() {

    let validator = should.be.truthy.__exec();

    expect(await validator(true)).to.be.true;
    expect(await validator('some string')).to.be.true;
    expect(await validator('')).to.be.false;
    expect(await validator(false)).to.be.false;
    expect(await validator(0)).to.be.false;
    expect(await validator({})).to.be.true;
    expect(await validator([])).to.be.true;

  });

  it('should validate falsey values correctly', async function() {

    let validator = should.be.falsey.__exec();

    expect(await validator(true)).to.be.false;
    expect(await validator('some string')).to.be.false;
    expect(await validator('')).to.be.true;
    expect(await validator(false)).to.be.true;
    expect(await validator(0)).to.be.true;
    expect(await validator({})).to.be.false;
    expect(await validator([])).to.be.false;

  });

  it('should validate number ranges correctly', async function() {

    let validator = should.be.gt(0).__exec();

    expect(await validator(0)).to.be.false;
    expect(await validator(-1)).to.be.false;
    expect(await validator(.5)).to.be.true;

    validator = should.be.gte(0).__exec();

    expect(await validator(0)).to.be.true;
    expect(await validator(-1)).to.be.false;
    expect(await validator(.5)).to.be.true;

    validator = should.be.lt(100).__exec();

    expect(await validator(100)).to.be.false;
    expect(await validator(99)).to.be.true;
    expect(await validator(-1)).to.be.true;

    validator = should.be.lte(100).__exec();

    expect(await validator(100)).to.be.true;
    expect(await validator(101)).to.be.false;
    expect(await validator(-1)).to.be.true;

    validator = should.be.between(0, 100).__exec();

    expect(await validator(100)).to.be.true;
    expect(await validator(0)).to.be.true;
    expect(await validator(50)).to.be.true;
    expect(await validator(200)).to.be.false;
    expect(await validator(-1)).to.be.false;

    validator = should.be.betweenEx(0, 100).__exec();

    expect(await validator(100)).to.be.false;
    expect(await validator(0)).to.be.false;
    expect(await validator(50)).to.be.true;
    expect(await validator(200)).to.be.false;
    expect(await validator(-1)).to.be.false;

    validator = should.be.positive.__exec();

    expect(await validator(1)).to.be.true;
    expect(await validator(0)).to.be.false;
    expect(await validator(-1)).to.be.false;

    validator = should.be.negative.__exec();

    expect(await validator(1)).to.be.false;
    expect(await validator(0)).to.be.false;
    expect(await validator(-1)).to.be.true;

  });

  it('should validate number ranges from reference correctly', async function() {

    const body = {
      num1: 0,
      num2: 100
    };
    let validator = should.be.gtRef('num1').__exec();

    expect(await validator(0, body)).to.be.false;
    expect(await validator(-1, body)).to.be.false;
    expect(await validator(.5, body)).to.be.true;

    validator = should.be.gteRef('num1').__exec();

    expect(await validator(0, body)).to.be.true;
    expect(await validator(-1, body)).to.be.false;
    expect(await validator(.5, body)).to.be.true;

    validator = should.be.ltRef('num2').__exec();

    expect(await validator(100, body)).to.be.false;
    expect(await validator(99, body)).to.be.true;
    expect(await validator(-1, body)).to.be.true;

    validator = should.be.lteRef('num2').__exec();

    expect(await validator(100, body)).to.be.true;
    expect(await validator(101, body)).to.be.false;
    expect(await validator(-1, body)).to.be.true;

  });

  it('should validate number types correctly', async function() {

    let validator = should.be.zero.__exec();

    expect(await validator(0)).to.be.true;
    expect(await validator('0')).to.be.true;
    expect(await validator('')).to.be.true;
    expect(await validator('abc')).to.be.false;
    expect(await validator(1)).to.be.false;

    validator = should.be.even.__exec();

    expect(await validator(0)).to.be.true;
    expect(await validator('12')).to.be.true;
    expect(await validator('')).to.be.true;
    expect(await validator('abc')).to.be.false;
    expect(await validator(1)).to.be.false;
    expect(await validator(139)).to.be.false;

    validator = should.be.odd.__exec();

    expect(await validator(0)).to.be.false;
    expect(await validator('12')).to.be.false;
    expect(await validator('')).to.be.false;
    expect(await validator('abc')).to.be.false;
    expect(await validator(1)).to.be.true;
    expect(await validator(139)).to.be.true;

  });

  it('should validate emails correctly', async function() {

    let validator = should.be.an.email.__exec();

    expect(await validator('username@gmail.com')).to.be.true;
    expect(await validator('username_1990@gmail12-c.work')).to.be.true;
    expect(await validator('user.name@sub.gmail.com')).to.be.true;
    expect(await validator('email.com')).to.be.false;
    expect(await validator(undefined)).to.be.false;
    expect(await validator('')).to.be.false;
    expect(await validator('username+tag@gmail.com')).to.be.true;
    expect(await validator('username!!!@gmail.com')).to.be.false;

  });

  it('should validate using "equal" and "equalRef" correctly', async function() {

    const body = {
      name: {
        first: 'Steve',
        last: 'Gates'
      },
      fullName: 'Bill Jobs'
    };

    let validator = should.be.equal('value').__exec();

    expect(await validator('value')).to.be.true;
    expect(await validator('value ')).to.be.false;
    expect(await validator(undefined)).to.be.false;

    validator = should.be.equalRef('name.first').__exec();

    expect(await validator('Steve', body)).to.be.true;
    expect(await validator('Bill', body)).to.be.false;

    validator = should.be.equalRef('name.last').__exec();

    expect(await validator('Gates', body)).to.be.true;
    expect(await validator('Jobs', body)).to.be.false;

    validator = should.be.equalRef('fullName').__exec();

    expect(await validator('Bill Jobs', body)).to.be.true;
    expect(await validator('bill jobs', body)).to.be.false;

  });

  it('should validate using "exist" correctly', async function() {

    let validator = should.exist.__exec();

    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.true;
    expect(await validator('string')).to.be.true;
    expect(await validator(0)).to.be.true;
    expect(await validator(NaN)).to.be.true;

  });

  it('should match strings correctly', async function() {

    let validator = should.match(/(?<=^https:\/\/).+\..+$/i).__exec();

    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator('string')).to.be.false;
    expect(await validator(0)).to.be.false;
    expect(await validator(NaN)).to.be.false;
    expect(await validator('ftp://blah.com')).to.be.false;
    expect(await validator('http://blah.net')).to.be.false;
    expect(await validator('https://blah.com')).to.be.true;

  });

  it('should validate inclusions correctly', async function() {

    const body = {
      value: null,
      collection: [1,2,3]
    };

    let validator = should.include(Infinity).__exec();

    expect(await validator('Infinity')).to.be.true;
    expect(await validator('stringfinity')).to.be.false;

    validator = should.include('a').__exec();

    expect(await validator('some-string')).to.be.false;
    expect(await validator('a-string')).to.be.true;
    expect(await validator([1, 2, 3])).to.be.false;

    validator = should.includeRef('value').__exec();

    expect(await validator(undefined, body)).to.be.false;
    expect(await validator(null, body)).to.be.false;
    expect(await validator('null', body)).to.be.true;
    expect(await validator([null, 0, 'string'], body)).to.be.true;

    validator = should.includeAll('a', 1, null).__exec();

    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator('null')).to.be.false;
    expect(await validator([null, 0, 1, 'a', 'string'])).to.be.true;

    validator = should.be.in([1,2,3,'s']).__exec();

    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator('null')).to.be.false;
    expect(await validator([null, 0, 'string'])).to.be.false;
    expect(await validator(2)).to.be.true;
    expect(await validator('s')).to.be.true;

    validator = should.be.inRef('value').__exec();

    expect(await validator(null, body)).to.be.false;
    expect(await validator(undefined, body)).to.be.false;
    expect(await validator(0, body)).to.be.false;

    validator = should.be.inRef('resolveToUndefined').__exec();

    expect(await validator(null, body)).to.be.false;
    expect(await validator(undefined, body)).to.be.false;
    expect(await validator(0, body)).to.be.false;

    validator = should.be.inRef('collection').__exec();

    expect(await validator(2, body)).to.be.true;
    expect(await validator(undefined, body)).to.be.false;
    expect(await validator(0, body)).to.be.false;

  });

  it('should validate enums correctly', async function() {

    enum StringEnum {
      Value1 = 'value1',
      Value2 = 'value2',
    }

    enum NumericEnum {
      Value1,
      Value2 = 3
    }

    let validator = should.belong.to.enum(StringEnum).__exec();

    expect(await validator('value1')).to.be.true;
    expect(await validator('Value1')).to.be.false;
    expect(await validator(0)).to.be.false;
    expect(await validator(StringEnum.Value2)).to.be.true;

    validator = should.belong.to.enum(NumericEnum).__exec();

    expect(await validator('value1')).to.be.false;
    expect(await validator('Value2')).to.be.true;
    expect(await validator(0)).to.be.true;
    expect(await validator(NumericEnum.Value2)).to.be.true;
    expect(await validator(2)).to.be.false;
    expect(await validator(3)).to.be.true;

    validator = should.belong.to.enum(undefined).__exec();

    expect(await validator('value1')).to.be.false;
    expect(await validator('Value1')).to.be.false;
    expect(await validator(0)).to.be.false;
    expect(await validator(StringEnum.Value2)).to.be.false;

    validator = should.belong.to.enum(null).__exec();

    expect(await validator('value1')).to.be.false;
    expect(await validator('Value1')).to.be.false;
    expect(await validator(0)).to.be.false;
    expect(await validator(StringEnum.Value2)).to.be.false;

    validator = should.belong.to.enum(123).__exec();

    expect(await validator('value1')).to.be.false;
    expect(await validator('Value1')).to.be.false;
    expect(await validator(0)).to.be.false;
    expect(await validator(StringEnum.Value2)).to.be.false;

  });

  it('should validate dates correctly', async function() {

    let validator = should.be.a.date.__exec();

    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(0)).to.be.true;
    expect(await validator(Date.now())).to.be.true;
    expect(await validator('2020-8-27 12:11 pm')).to.be.true;

  });

  it('should validate timezones correctly', async function() {

    let validator = should.be.a.valid.timezone.__exec();

    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator('America/Captain')).to.be.false;
    expect(await validator('America/Los_Angeles')).to.be.true;
    expect(await validator('Iran')).to.be.true;

  });

  it('should validate empty values correctly', async function() {

    let validator = should.be.empty.__exec();

    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator([])).to.be.true;
    expect(await validator([1])).to.be.false;
    expect(await validator(0)).to.be.true;
    expect(await validator(123)).to.be.false;
    expect(await validator('')).to.be.true;
    expect(await validator('string')).to.be.false;
    expect(await validator({})).to.be.true;
    expect(await validator({ a: 1 })).to.be.false;
    expect(await validator(NaN)).to.be.false;
    expect(await validator(/abc/)).to.be.false;
    expect(await validator(false)).to.be.false;
    expect(await validator(true)).to.be.false;

  });

  it('should validate children correctly', async function() {

    const body = {
      author: {
        first: 'Mahatma',
        last: 'Bush'
      },
      books: [
        { title: 'Peace Accomplished!', available: true, year: 1990 },
        { title: 'Why we went back to 1990', available: false, year: 2045 },
        { title: 'CC Roast Book', available: true, year: 2018 }
      ],
      tags: ['is', 'not', 'a', 'real', 'person']
    };

    let validator = should.have.children({
      first: should.be.a.non.empty.string,
      last: should.be.a.non.empty.string.__exec()
    }).__exec();

    expect(await validator(body.author)).to.be.true;
    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(body.tags)).to.be.false;

    validator = should.have.children(that.is.an.object).__exec();

    expect(await validator(body.author)).to.be.true;
    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(body.tags)).to.be.false;
    expect(await validator(body.books)).to.be.true;

    validator = should.have.children(that.are.non.empty.strings).__exec();

    expect(await validator(body.author)).to.be.false;
    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(body.tags)).to.be.true;

    validator = should.have.children(that.are.non.empty.strings.__exec()).__exec();

    expect(await validator(body.author)).to.be.false;
    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(body.tags)).to.be.true;

    validator = should.have.children({
      title: should.be.string,
      available: should.be.boolean,
      year: should.be.number
    }).__exec();

    expect(await validator(body.author)).to.be.false;
    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(body.books)).to.be.true;

  });

});
