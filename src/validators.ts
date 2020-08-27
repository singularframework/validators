import 'source-map-support/register';
import { ValidatorFunction, AsyncValidatorFunction, resolveRef, ValidationDefinition } from '@singular/core';
import validators from './definitions';

export class Validators {

  constructor(
    private __validators: Array<ValidatorFunction|AsyncValidatorFunction> = [],
    private __lengthAsValue: boolean = false,
    private __negate: boolean = false,
    private __negateNext: boolean = false,
    private __optional: boolean = false,
    private __refAsValue: string = null,
    private __conditions: Array<ValidatorFunction|AsyncValidatorFunction> = [],
    private __strictConditions: boolean = false,
    private __errorMessage: string = null
  ) { }

  /** Wraps a validator if necessary based on this.__negate, this.__negateNext, and this.__lengthAsValue. */
  private __wrapIfNecessary(validator: ValidatorFunction|AsyncValidatorFunction): ValidatorFunction|AsyncValidatorFunction {

    let wrapped = validator;

    if ( this.__lengthAsValue ) wrapped = validators.length(wrapped);
    if ( this.__negate ) wrapped = validators.not(wrapped);
    if ( this.__negateNext ) wrapped = validators.not(wrapped);

    return wrapped;

  }

  /** Returns a new Validators object with the given validator added to the array (also carries this.__lengthAsValue). */
  private __addValidator(validator: ValidatorFunction|AsyncValidatorFunction) {

    return new Validators(
      this.__validators.concat(this.__wrapIfNecessary(validator)),
      this.__lengthAsValue,
      this.__negate,
      false,
      this.__optional,
      this.__refAsValue,
      this.__conditions,
      this.__strictConditions,
      this.__errorMessage
    );

  }

  /**
  * NO NEED TO CALL THIS METHOD
  *
  * Finalizes the validators as one validator function (ANDs all used validators).
  */
  public __exec(): AsyncValidatorFunction {

    return async (value: any, rawValues?: any) => {

      // If value needs to be resolved from ref
      if ( this.__refAsValue ) value = resolveRef(this.__refAsValue, rawValues);
      // If whole validation is optional
      if ( this.__optional && value === undefined ) return true;

      // If conditional validation
      if ( this.__conditions.length ) {

        let result = true;

        // AND all conditions
        for ( const validator of this.__conditions ) {

          const validatorResult = await validator(value, rawValues);

          // Ignore when conditions are not true
          if ( validatorResult instanceof Error || validatorResult === false ) result = false;

        }

        // Strict conditions where conditions didn't pass (expect value to be undefined)
        if ( this.__strictConditions && ! result ) {

          const isUndefined = value === undefined;

          if ( isUndefined ) return true;

          return this.__errorMessage ? new Error(this.__errorMessage) : false;

        }
        // Loose conditions where conditions didn't pass (ignore validation)
        else if ( ! result ) {

          return true;

        }

      }

      // AND all validators
      for ( const validator of this.__validators ) {

        const validatorResult = await validator(value, rawValues);

        if ( validatorResult instanceof Error ) return validatorResult;
        if ( ! validatorResult ) return this.__errorMessage ? new Error(this.__errorMessage) : false;

      }

      return true;

    };

  }

  // Aesthetics

  /** Aesthetic property. */
  public get should() { return this; }
  /** Aesthetic property. */
  public get be() { return this; }
  /** Aesthetic property. */
  public get and() { return this; }
  /** Aesthetic property. */
  public get have() { return this; }
  /** Aesthetic property. */
  public get a() { return this; }
  /** Aesthetic property. */
  public get an() { return this; }
  /** Aesthetic property. */
  public get been() { return this; }
  /** Aesthetic property. */
  public get has() { return this; }
  /** Aesthetic property. */
  public get of() { return this; }
  /** Aesthetic property. */
  public get to() { return this; }
  /** Aesthetic property. */
  public get belong() { return this; }
  /** Aesthetic property. */
  public get belongs() { return this; }
  /** Aesthetic property. */
  public get it() { return this; }
  /** Aesthetic property. */
  public get its() { return this; }
  /** Aesthetic property. */
  public get must() { return this; }
  /** Aesthetic property. */
  public get these() { return this; }
  /** Aesthetic property. */
  public get that() { return this; }
  /** Aesthetic property. */
  public get as() { return this; }
  /** Aesthetic property. */
  public get are() { return this; }
  /** Aesthetic property. */
  public get is() { return this; }
  /** Aesthetic property. */
  public get which() { return this; }
  /** Aesthetic property. */
  public get where() { return this; }
  /** Aesthetic property. */
  public get does() { return this; }
  /** Aesthetic property. */
  public get with() { return this; }
  /** Aesthetic property. */
  public get do() { return this; }

  // Type checkers

  /** Checks the value to be a string. */
  public get string() { return this.__addValidator(validators.string); }
  /** Checks the value to be a boolean. */
  public get boolean() { return this.__addValidator(validators.boolean); }
  /** Checks the value to be a number. */
  public get number() { return this.__addValidator(validators.number); }
  /** Checks the value to be an object. */
  public get object() { return this.__addValidator(validators.object); }
  /** Checks the value to be an array. */
  public get array() { return this.__addValidator(validators.array); }

  // Mutators

  /** Negates the next validator. */
  public get non() {

    return new Validators(
      this.__validators,
      this.__lengthAsValue,
      this.__negate,
      true,
      this.__optional,
      this.__refAsValue,
      this.__conditions,
      this.__strictConditions,
      this.__errorMessage
    );

  }

  /** Negates all validators from this point forward. */
  public get not() {

    return new Validators(
      this.__validators,
      this.__lengthAsValue,
      true,
      this.__negateNext,
      this.__optional,
      this.__refAsValue,
      this.__conditions,
      this.__strictConditions,
      this.__errorMessage
    );

  }

  /** Looks at value.length instead of value from this point forward. */
  public get length() {

    return new Validators(
      this.__validators.concat(validators.hasLength),
      true,
      this.__negate,
      this.__negateNext,
      this.__optional,
      this.__refAsValue,
      this.__conditions,
      this.__strictConditions,
      this.__errorMessage
    );

  }

  /** Sets a custom error message to be shown when validations don't pass. */
  public otherwise(message: string) {

    this.__errorMessage = message;

    return this;

  }

  // Value comparison shorthands

  /** Checks if value is undefined. */
  public get undefined() { return this.__addValidator(validators.undefined); }
  /** Checks if value is null. */
  public get null() { return this.__addValidator(validators.null); }
  /** Checks if value is NaN. */
  public get NaN() { return this.__addValidator(validators.NaN); }
  /** Checks if value is true. */
  public get true() { return this.__addValidator(validators.true); }
  /** Checks if value is false. */
  public get false() { return this.__addValidator(validators.false); }
  /** Checks is value is truthy. */
  public get truthy() { return this.__addValidator(validators.truthy); }
  /** Checks if value is falsey. */
  public get falsey() { return this.__addValidator(validators.falsey); }

  // Casting validators

  /** Checks if value (casted to number) is greater than target. */
  public gt(target: number) { return this.__addValidator(validators.gt(target)); }
  /** Checks if value (casted to number) is greater than target resolved from reference (casted to number). */
  public gtRef(ref: string) { return this.__addValidator(validators.gtRef(ref)); }
  /** Checks if value (casted to number) is greater than or equal to target. */
  public gte(target: number) { return this.__addValidator(validators.gte(target)); }
  /** Checks if value (casted to number) is greater than or equal to target resolved from reference (casted to number). */
  public gteRef(ref: string) { return this.__addValidator(validators.gteRef(ref)); }
  /** Checks if value (casted to number) is less than target. */
  public lt(target: number) { return this.__addValidator(validators.lt(target)); }
  /** Checks if value (casted to number) is less than target resolved from reference (casted to number). */
  public ltRef(ref: string) { return this.__addValidator(validators.ltRef(ref)); }
  /** Checks if value (casted to number) is less than or equal to target. */
  public lte(target: number) { return this.__addValidator(validators.lte(target)); }
  /** Checks if value (casted to number) is less than or equal to target resolved from reference (casted to number). */
  public lteRef(ref: string) { return this.__addValidator(validators.lteRef(ref)); }
  /** Checks if value (casted to number) is between the given targets (inclusive). */
  public between(min: number, max: number) { return this.__addValidator(validators.between(min, max)); }
  /** Checks if value (casted to number) is between the given targets (exclusive). */
  public betweenEx(min: number, max: number) { return this.__addValidator(validators.betweenEx(min, max)); }
  /** Checks if value (casted to number) is a positive number. */
  public get positive() { return this.__addValidator(validators.positive); }
  /** Checks if value (casted to number) is a negative number. */
  public get negative() { return this.__addValidator(validators.negative); }
  /** Checks if value (casted to number) is zero. */
  public get zero() { return this.__addValidator(validators.zero); }
  /** Checks if value (casted to number) is an even number. */
  public get even() { return this.__addValidator(validators.even); }
  /** Checks if value (casted to number) is an odd number. */
  public get odd() { return this.__addValidator(validators.odd); }
  /** Checks if value (casted to string) is a valid email. */
  public get email() { return this.__addValidator(validators.email); }

  // Logic gates

  /** ORs all given validators. */
  public either(
    validator: ValidatorFunction|AsyncValidatorFunction|Validators,
    ...additionalValidators: Array<ValidatorFunction|AsyncValidatorFunction|Validators>
  ) {

    return this.__addValidator(validators.or(...[].concat(
      validator instanceof Validators ? validator.__exec() : validator,
      ...additionalValidators.map(validator => validator instanceof Validators ? validator.__exec() : validator)
    )));

  }

  /** Runs the validators on value if all passed-in validators pass the validation. */
  public when(
    validator: ValidatorFunction|AsyncValidatorFunction|Validators,
    ...additionalValidators: Array<ValidatorFunction|AsyncValidatorFunction|Validators>
  ) {

    this.__conditions = this.__conditions.concat(
      validator instanceof Validators ? validator.__exec() : validator,
      ...additionalValidators.map(validator => validator instanceof Validators ? validator.__exec() : validator)
    );

    return this;

  }

  /** Runs the validators on value if all passed-in validators pass the validation, otherwise checks the value to be undefined. */
  public onlyWhen(
    validator: ValidatorFunction|AsyncValidatorFunction|Validators,
    ...additionalValidators: Array<ValidatorFunction|AsyncValidatorFunction|Validators>
  ) {

    this.__strictConditions = true;

    return this.when(validator, ...additionalValidators);

  }

  // Other validators

  /** Checks if value is equal to target. */
  public equal(target: any) { return this.__addValidator(validators.equal(target)); }
  /** Checks if value is equal to target resolved from reference. */
  public equalRef(ref: string) { return this.__addValidator(validators.equalRef(ref)); }
  /** Checks if value is not undefined. */
  public get exist() { return this.__addValidator(validators.exist); }
  /** Checks if value matches a regular expression (using value.match). */
  public match(regex: RegExp) { return this.__addValidator(validators.match(regex)); }
  /** Checks if value includes target (using value.includes). */
  public include(target: any) { return this.__addValidator(validators.include(target)); }
  /** Checks if value includes target resolved from reference (using value.includes). */
  public includeRef(ref: string) { return this.__addValidator(validators.includeRef(ref)); }
  /** Checks if value includes all targets (using value.includes). */
  public includeAll(...targets: any[]) { return this.__addValidator(validators.includeAll(...targets)); }
  /** Checks if value is included in target (using target.includes). */
  public in(target: any) { return this.__addValidator(validators.in(target)); }
  /** Checks if value is included in target resolved from reference (using target.includes). */
  public inRef(ref: string) { return this.__addValidator(validators.inRef(ref)); }
  /** Checks if value belongs to enum. */
  public enum(enumerator: any) { return this.__addValidator(validators.enum(enumerator)); }
  /** Checks if a valid date can be constructed using the value. */
  public get date() { return this.__addValidator(validators.date); }
  /** Checks if value is a valid IANA timezone. */
  public get timezone() { return this.__addValidator(validators.timezone); }
  /**
  * Checks if value is empty.
  * This validator checks for zero length for strings and arrays, zero value for numbers, and no children for objects.
  */
  public get empty() { return this.__addValidator(validators.empty); }
  /**
  * Runs the given validator for value's children. Validator can be a validation definition for nested validation.
  *
  * If value is an object, a validation definition will check the value's children key-by-key, and a validator function (or executable validators) will check the whole object.
  * If value is an array, a validation definition will expect an array of objects, checking each item's children key-by-key, while a validator function (or executable validators) will check each item in the array.
  */
  public children(
    validator: ValidationDefinition|ValidatorFunction|AsyncValidatorFunction|Validators,
    localRefs?: boolean
  ) {

    return this.__addValidator(validators.children(
      validator instanceof Validators ? validator.__exec() : validator,
      localRefs
    ));

  }

}

/** Aesthetic property. */
export const should = new Validators();
/** Aesthetic property. */
export const be = new Validators();
/** Aesthetic property. */
export const and = new Validators();
/** Aesthetic property. */
export const have = new Validators();
/** Aesthetic property. */
export const a = new Validators();
/** Aesthetic property. */
export const an = new Validators();
/** Aesthetic property. */
export const been = new Validators();
/** Aesthetic property. */
export const has = new Validators();
/** Aesthetic property. */
export const of = new Validators();
/** Aesthetic property. */
export const to = new Validators();
/** Aesthetic property. */
export const belong = new Validators();
/** Aesthetic property. */
export const belongs = new Validators();
/** Aesthetic property. */
export const it = new Validators();
/** Aesthetic property. */
export const its = new Validators();
/** Aesthetic property. */
export const must = new Validators();
/** Aesthetic property. */
export const these = new Validators();
/** Aesthetic property. */
export const that = new Validators();
/** Aesthetic property. */
export const as = new Validators();
/** Aesthetic property. */
export const are = new Validators();
/** Aesthetic property. */
export const is = new Validators();
/** Aesthetic property. */
export const which = new Validators();
/** Aesthetic property. */
export const where = new Validators();
/** Aesthetic property. */
export const does = new Validators();
/** Optional validation which ignores validation rules when value is undefined. */
export const could = new Validators([], false, false, false, true);
/** Returns validators for the value resolved from a path. */
export function $(ref: string) { return new Validators([], false, false, false, false, ref); }
