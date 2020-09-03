import 'source-map-support/register';
import { should, could, that, is, does, $, are, be, there, these } from '../../dist/validators';
import { expect } from 'chai';
import { ValidationDefinition, AsyncValidatorFunction } from '@singular/common';

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
    validator = should.be.a.non.empty.string.existWhen(
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

    // Checking local refs

    validator = should.have.children({
      title: that.exists.onlyIf($('tags').includes('person'))
    }).__exec();

    expect(await validator(body.books, body)).to.be.true;

    validator = should.have.children({
      title: that.exists.onlyIf($('tags').includes('person'))
    }, true).__exec();

    expect(await validator(body.books, body)).to.be.false;

    validator = should.have.children({
      last: that.equals('Bush').onlyIf($('first').equals('Mahatma'))
    }, true).__exec();

    expect(await validator(body.author, body)).to.be.true;

    validator = should.have.children({
      last: that.equals('Bush').onlyIf($('first').equals('Mahatma'))
    }).__exec();

    expect(await validator(body.author, body)).to.be.false;

  });

  it('should validate using "either" correctly', async function() {

    let validator = should.be.a.string.that.either(
      is.equal('google.com'),
      does.match(/^http(s)?:\/\/.+\.[a-z]+$/i),
      // Validate public IP address
      (value: string) => {

        const segments = value.split('.');

        if ( segments.length !== 4 ) return false;
        if ( segments.filter(s => ! isNaN(+s)).length !== 4 ) return false;
        if ( +segments[0] < 1 || +segments[0] > 191 ) return false;
        if ( +segments[1] < 0 || +segments[1] > 255 ) return false;
        if ( +segments[2] < 0 || +segments[2] > 255 ) return false;
        if ( +segments[3] < 0 || +segments[3] > 255 ) return false;

        return true;

      }
    ).__exec();

    expect(await validator(undefined)).to.be.false;
    expect(await validator(null)).to.be.false;
    expect(await validator(123)).to.be.false;
    expect(await validator(NaN)).to.be.false;
    expect(await validator('google.com')).to.be.true;
    expect(await validator('yahoo.com')).to.be.false;
    expect(await validator('http://google.com')).to.be.true;
    expect(await validator('https://google.com')).to.be.true;
    expect(await validator('meh')).to.be.false;
    expect(await validator('145.0.2.91')).to.be.true;

  });

  it('should validate conditionally correctly', async function() {

    const body1 = {
      name: {
        first: 'George',
        last: 'Gandhi'
      }
    };

    const body2 = {
      fullName: 'Gandalf the Pink'
    };

    const body3 = {
      name: null,
      fullName: 'Gandalf the Pink'
    };

    const body4 = {
      name: {
        first: 'George',
        last: 'Gandhi'
      },
      fullName: null
    };

    const body5 = {
      name: null,
      fullName: null
    };

    const body6 = {
      fullName: null
    };

    const body7 = {
      name: 'James Bound',
      male: true
    };

    const body8 = {
      name: 'Cameron Piaz',
      female: true
    };

    const body9 = {
      name: 'Cameron Piaz',
      female: false
    };

    const body10 = {
      name: 'Cameron Niaz',
      female: true
    };

    let validator = should.be.a.non.empty.string.existWhen($('name').does.not.exist).__exec();

    expect(await validator(body2.fullName, body2)).to.be.true;
    expect(await validator(undefined, body1)).to.be.true;

    validator = should.be.an.object.with.children({
      first: that.is.a.non.empty.string,
      last: that.is.a.non.empty.string
    }).existWhen($('fullName').does.not.exist).__exec();

    expect(await validator(body1.name, body1)).to.be.true;
    expect(await validator(undefined, body2)).to.be.true;

    validator = should.be.a.non.empty.string.when($('name').either(
      is.not.an.object,
      does.not.have.children({
        first: that.is.a.non.empty.string,
        last: that.is.a.non.empty.string
      })
    )).__exec();

    expect(await validator(body3.fullName, body3)).to.be.true;
    expect(await validator(body4.fullName, body4)).to.be.true;
    expect(await validator(body5.fullName, body5)).to.be.false;

    validator = should.be.a.non.empty.string.unless($('name').exists).__exec();

    expect(await validator(body2.fullName, body2)).to.be.true;
    expect(await validator((<any>body1).fullName, body1)).to.be.false;
    expect(await validator(body6.fullName, body6)).to.be.false;

    validator = should.be.true.onlyWhen($('name').equals('James Bound')).__exec();

    expect(await validator(body7.male, body7)).to.be.true;
    expect(await validator((<any>body7).female, body7)).to.be.false;

    validator = should.be.true.onlyWhen($('name').equals('Cameron Piaz')).__exec();

    expect(await validator(body8.female, body8)).to.be.true;
    expect(await validator((<any>body7).female, body7)).to.be.false;
    expect(await validator(body9.female, body9)).to.be.false;
    expect(await validator(body10.female, body10)).to.be.false;

  });

  it('should validate using "allTrue" correctly', async function() {

    const body1 = {
      val1: 1,
      val2: 2,
      val3: 3,
      val4: 0,
      value: true
    };

    const body2 = {
      val1: 1,
      val2: 2,
      val3: 3,
      val4: 4,
      value: true
    };

    let validator = should.be.true.while.these.are.allTrue(
      $('val1').equals(1),
      $('val2').equals(2),
      $('val3').equals(3),
      $('val4').equals(4)
    ).__exec();

    expect(await validator(body1.value, body1)).to.be.false;
    expect(await validator(body2.value, body2)).to.be.true;

  });

  it('should validate using "could" correctly', async function() {

    let validator = could.be.a.non.empty.string.__exec();

    expect(await validator(undefined)).to.be.true;
    expect(await validator(null)).to.be.false;
    expect(await validator('')).to.be.false;
    expect(await validator('123')).to.be.true;
    expect(await validator(false)).to.be.false;

  });

  it('should validate using "$" for resolving references correctly', async function() {

    const body = {
      you: {
        have: {
          to: {
            reach: {
              here: {
                value1: true,
                value2: 123,
                value3: 'string'
              }
            }
          }
        }
      }
    };

    let validator = $('you.have.to.reach.here.value1').should.be.a.boolean.__exec();

    expect(await validator('not a boolean', body)).to.be.true;
    expect(await validator(undefined, body)).to.be.true;

    validator = $('you.have.to.reach.here.value2').should.be.a.number.__exec();

    expect(await validator('not a number', body)).to.be.true;
    expect(await validator(undefined, body)).to.be.true;

    validator = $('you.have.to.reach.here.value3').should.be.equal('strings').__exec();

    expect(await validator('string', body)).to.be.false;
    expect(await validator(undefined, body)).to.be.false;

    validator = $('cant.reach.here').should.be.a.boolean.__exec();

    expect(await validator('not a boolean', body)).to.be.false;
    expect(await validator(undefined, body)).to.be.false;

    validator = $('cant.reach.here').should.be.undefined.__exec();

    expect(await validator('not a boolean', body)).to.be.true;
    expect(await validator(null, body)).to.be.true;

  });

  it('should validate correctly using ridiculously complex rules!', async function () {

    enum RequestType {

      /** Requesting a service. */
      ServiceRequest,
      /** Providing a service. */
      ServiceAcceptanceRequest

    }

    enum ServiceProvided {

      WebDevelopment = 'web',
      ComputerRepair = 'repair'

    }

    enum ServiceNeeded {

      ManCaveCleaning = 'clean',
      ExtensiveTherapy = 'therapy'

    }

    interface Request {

      type: RequestType;
      message?: string;
      date: string;
      email: string;

    }

    const backendTechnologies = ['nodejs', 'express', 'singular'];
    const frontendTechnologies = ['angular', 'react', 'vue'];

    interface WebDevelopmentRequest extends Request {

      type: RequestType.ServiceRequest;
      serviceRequested: ServiceProvided.WebDevelopment;
      /** Should only exist if "frontend" does not exist or is false. */
      backend?: boolean;
      /** Should only exist if "backend" does not exist or is false. */
      frontend?: boolean;
      /** Either part of "backendTechnologies" or "frontendTechnologies" based on "backend" value. */
      technologies: string[];

    }

    interface ComputerRepairRequest extends Request {

      type: RequestType.ServiceRequest;
      serviceRequested: ServiceProvided.ComputerRepair;
      issues: {
        cause: 'hardware'|'software',
        explanation: string;
      }[];
      address: {
        street: string;
        street2?: string;
        city: string;
        state: string;
        zip: number;
      };

    }

    interface CleaningAcceptanceRequest extends Request {

      type: RequestType.ServiceAcceptanceRequest;
      serviceProvided: ServiceNeeded.ManCaveCleaning;
      /** From 0 to 1. */
      filthPercentage: number;
      availableHours: {
        /** Must be between 0 (inclusive) to 24 (exclusive) and before "availableHours.to". */
        from: number;
        /** Must be between 0 (inclusive) to 24 (exclusive) and after "availableHours.from". */
        to: number;
      };

    }

    interface TherapyAcceptanceRequest extends Request {

      type: RequestType.ServiceAcceptanceRequest;
      serviceProvided: ServiceNeeded.ExtensiveTherapy;
      assignedTherapist: {
        name: string;
        /** Must be greater than 18. */
        age: number;
        /** Must be less than "age" and not zero. */
        yearsOfExperience: number;
      };
      remote: boolean;
      /** Must exist if "remote" is false. */
      address?: {
        street: string;
        street2?: string;
        city: string;
        state: string;
        zip: number;
      };

    }

    // Valid requests
    const backendDevelopmentRequest: WebDevelopmentRequest = {
      type: RequestType.ServiceRequest,
      serviceRequested: ServiceProvided.WebDevelopment,
      backend: true,
      frontend: false,
      technologies: ['nodejs', 'singular'],
      message: 'Build a server that doesn\'t suck!',
      date: '2020-8-27 3:27 pm',
      email: 'requester@makerequests.net'
    };

    const frontendDevelopmentRequest: WebDevelopmentRequest = {
      type: RequestType.ServiceRequest,
      serviceRequested: ServiceProvided.WebDevelopment,
      frontend: true,
      technologies: ['angular'],
      message: 'Build a web app that doesn\'t suck!',
      date: '2020-8-27 3:27 pm',
      email: 'requester@makerequests.net'
    };

    const repairRequest: ComputerRepairRequest = {
      type: RequestType.ServiceRequest,
      serviceRequested: ServiceProvided.ComputerRepair,
      issues: [
        { cause: 'software', explanation: 'Windows is forcing updates while I\'m rendering a video for a client...' },
        { cause: 'hardware', explanation: 'VGA has gone color blind!' },
        { cause: 'hardware', explanation: 'CPU is singing "Hammer Smashed Face" by Cannibal Corpse!' }
      ],
      address: {
        street: '12345 Shakira ave.',
        city: 'Piqueland',
        state: 'Spainophobia',
        zip: 10902053
      },
      date: '2020-8-27 3:27 pm',
      email: 'requester@makerequests.net'
    };

    const cleaningRequest: CleaningAcceptanceRequest = {
      type: RequestType.ServiceAcceptanceRequest,
      serviceProvided: ServiceNeeded.ManCaveCleaning,
      filthPercentage: .9,
      availableHours: {
        from: 12,
        to: 18
      },
      date: '2020-8-27',
      email: 'info@cavemenservices.com',
      message: 'We will not touch your electronics. P.S: Our employees tend to steal stuff!'
    };

    const therapyRequest: TherapyAcceptanceRequest = {
      type: RequestType.ServiceAcceptanceRequest,
      serviceProvided: ServiceNeeded.ExtensiveTherapy,
      assignedTherapist: {
        name: 'Prof. Chaos',
        age: 51,
        yearsOfExperience: 23
      },
      remote: true,
      date: '2020-8-27',
      email: 'muhahaha@evilkids.care',
      message: 'Just like a paper clip, I can bend you, and shape you, and make you... straight!'
    };

    const therapyRequest2: TherapyAcceptanceRequest = {
      type: RequestType.ServiceAcceptanceRequest,
      serviceProvided: ServiceNeeded.ExtensiveTherapy,
      assignedTherapist: {
        name: 'Prof. Chaos',
        age: 51,
        yearsOfExperience: 23
      },
      remote: false,
      address: {
        street: '12345 Shakira ave.',
        city: 'Piqueland',
        state: 'Spainophobia',
        zip: 10902053
      },
      date: '2020-8-27',
      email: 'muhahaha@evilkids.care',
      message: 'Just like a paper clip, I can bend you, and shape you, and make you... straight!'
    };

    const invalidTherapyRequest: TherapyAcceptanceRequest = {
      type: RequestType.ServiceAcceptanceRequest,
      serviceProvided: ServiceNeeded.ExtensiveTherapy,
      assignedTherapist: {
        name: 'Prof. Chaos',
        age: 51,
        yearsOfExperience: 23
      },
      remote: true,
      address: {
        street: '12345 Shakira ave.',
        city: 'Piqueland',
        state: 'Spainophobia',
        zip: 10902053
      },
      date: '2020-8-27',
      email: 'muhahaha@evilkids.care',
      message: 'Just like a paper clip, I can bend you, and shape you, and make you... straight!'
    };

    const invalidCleaningRequest: CleaningAcceptanceRequest = {
      type: RequestType.ServiceAcceptanceRequest,
      serviceProvided: ServiceNeeded.ManCaveCleaning,
      filthPercentage: .9,
      availableHours: {
        from: 12,
        to: 3
      },
      date: '2020-8-27',
      email: 'info@cavemenservices.com',
      message: 'We will not touch your electronics. P.S: Our employees tend to steal stuff!'
    };

    const invalidFrontendDevelopmentRequest: WebDevelopmentRequest = {
      type: RequestType.ServiceRequest,
      serviceRequested: ServiceProvided.WebDevelopment,
      frontend: true,
      backend: true,
      technologies: ['angular'],
      message: 'Build a web app that doesn\'t suck!',
      date: '2020-8-27 3:27 pm',
      email: 'requester@makerequests.net'
    };

    async function runDefinition(def: ValidationDefinition, body: any): Promise<boolean|Error> {

      for ( const key in def ) {

        const result = await (<AsyncValidatorFunction>def[key])(body[key], body);

        if ( ! result || result instanceof Error ) return result;

      }

      return true;

    }

    // Validator
    const validator: ValidationDefinition = {
      type: should.belong.to.enum(RequestType).__exec(),
      serviceRequested: should.exist.and.belong.to.enum(ServiceProvided).existIf($('type').equals(RequestType.ServiceRequest)).__exec(),
      serviceProvided: should.exist.and.belong.to.enum(ServiceNeeded).existIf($('type').equals(RequestType.ServiceAcceptanceRequest)).__exec(),
      backend: should.have.these.allTrue(
        is.true.unless($('frontend').is.true),
      ).existIf($('serviceRequested').equals(ServiceProvided.WebDevelopment)).__exec(),
      frontend: should.either(
        be.true.onlyWhen($('backend').either(does.not.exist, is.false)),
        be.either(
          is.false.onlyWhen($('backend').is.true),
          does.not.exist.onlyWhen($('backend').is.true)
        )
      ).existIf($('serviceRequested').equals(ServiceProvided.WebDevelopment)).__exec(),
      technologies: should.be.an.array.and.have.children(that.either(
        are.in(backendTechnologies).onlyWhen($('backend').is.true),
        are.in(frontendTechnologies).onlyWhen($('frontend').is.true)
      )).existIf($('serviceRequested').equals(ServiceProvided.WebDevelopment)).__exec(),
      issues: should.be.an.array.with.children({
        cause: should.be.in(['hardware', 'software']),
        explanation: should.be.a.non.empty.string
      }).existIf($('serviceRequested').equals(ServiceProvided.ComputerRepair)).__exec(),
      address: should.be.an.object.with.children({
        street: should.be.a.non.empty.string,
        street2: could.be.a.non.empty.string,
        city: could.be.a.non.empty.string,
        state: could.be.a.non.empty.string,
        zip: should.be.a.number
      }).existIf(there.is.either(
        $('serviceRequested').that.equals(ServiceProvided.ComputerRepair),
        these.are.allTrue(
          $('serviceProvided').that.equals(ServiceNeeded.ExtensiveTherapy),
          $('remote').is.false
        )
      )).__exec(),
      filthPercentage: should.be.a.number.between(0, 1).existWhen(
        $('serviceProvided').equals(ServiceNeeded.ManCaveCleaning)
      ).__exec(),
      availableHours: should.be.an.object.with.children({
        from: should.be.a.number.gte(0).and.lt(24).and.ltRef('availableHours.to'),
        to: should.be.a.number.gte(0).and.lt(24).and.gtRef('availableHours.from')
      }).existIf($('serviceProvided').equals(ServiceNeeded.ManCaveCleaning)).__exec(),
      remote: should.be.boolean.existWhen($('serviceProvided').that.equals(ServiceNeeded.ExtensiveTherapy)).__exec(),
      assignedTherapist: should.be.an.object.with.children({
        name: should.be.a.non.empty.string,
        age: should.be.a.number.gt(18),
        yearsOfExperience: should.be.a.number.that.is.non.zero.and.ltRef('assignedTherapist.age')
      }).existIf($('serviceProvided').that.equals(ServiceNeeded.ExtensiveTherapy)).__exec(),
      message: could.be.a.non.empty.string.__exec(),
      date: should.be.a.date.__exec(),
      email: should.be.an.email.__exec()
    };

    expect(await runDefinition(validator, backendDevelopmentRequest)).to.be.true;
    expect(await runDefinition(validator, frontendDevelopmentRequest)).to.be.true;
    expect(await runDefinition(validator, repairRequest)).to.be.true;
    expect(await runDefinition(validator, cleaningRequest)).to.be.true;
    expect(await runDefinition(validator, therapyRequest)).to.be.true;
    expect(await runDefinition(validator, therapyRequest2)).to.be.true;
    expect(await runDefinition(validator, invalidTherapyRequest)).to.be.false;
    expect(await runDefinition(validator, invalidCleaningRequest)).to.be.false;
    expect(await runDefinition(validator, invalidFrontendDevelopmentRequest)).to.be.false;

  });

});
