import { ValidatorFunction, AsyncValidatorFunction, resolveRef, ValidationDefinition } from '@singular/core';
import { DateTime, IANAZone } from 'luxon';

const validators = {
  string: <ValidatorFunction>(value => typeof value === 'string'),
  boolean: <ValidatorFunction>(value => typeof value === 'boolean'),
  number: <ValidatorFunction>(value => typeof value === 'number'),
  object: <ValidatorFunction>(value => !! value && typeof value === 'object' && value.constructor === Object),
  array: <ValidatorFunction>(value => !! value && typeof value === 'object' && value.constructor === Array),
  not: (validator: ValidatorFunction|AsyncValidatorFunction) => {

    return <AsyncValidatorFunction>(async (value, rawValues) => {

      const result = await validator(value, rawValues);

      if ( result instanceof Error ) return true;

      return ! result;

    });

  },
  length: (validator: ValidatorFunction|AsyncValidatorFunction) => {

    return <AsyncValidatorFunction>((value, rawValues) => {

      return validator(value.length, rawValues);

    });

  },
  hasLength: <ValidatorFunction>(value => {

    try {

      value.length;

      return true;

    }
    catch (error) {

      return false;

    }

  }),
  undefined: <ValidatorFunction>(value => value === undefined),
  null: <ValidatorFunction>(value => value === null),
  NaN: <ValidatorFunction>(value => isNaN(value)),
  true: <ValidatorFunction>(value => value === true),
  false: <ValidatorFunction>(value => value === false),
  truthy: <ValidatorFunction>(value => !! value),
  falsey: <ValidatorFunction>(value => ! value),
  equal: (target: any) => <ValidatorFunction>(value => value === target),
  equalRef: (ref: string) => <ValidatorFunction>((value, rawValues) => value === resolveRef(ref, rawValues)),
  gt: (target: number) => <ValidatorFunction>(value => +value > target),
  gtRef: (ref: string) => <ValidatorFunction>((value, rawValues) => +value > +resolveRef(ref, rawValues)),
  gte: (target: number) => <ValidatorFunction>(value => +value >= target),
  gteRef: (ref: string) => <ValidatorFunction>((value, rawValues) => +value >= +resolveRef(ref, rawValues)),
  lt: (target: number) => <ValidatorFunction>(value => +value < target),
  ltRef: (ref: string) => <ValidatorFunction>((value, rawValues) => +value < +resolveRef(ref, rawValues)),
  lte: (target: number) => <ValidatorFunction>(value => +value <= target),
  lteRef: (ref: string) => <ValidatorFunction>((value, rawValues) => +value <= +resolveRef(ref, rawValues)),
  between: (min: number, max: number) => <ValidatorFunction>(value => +value >= min && +value <= max),
  betweenEx: (min: number, max: number) => <ValidatorFunction>(value => +value > min && +value < max),
  negative: <ValidatorFunction>(value => +value < 0),
  positive: <ValidatorFunction>(value => +value > 0),
  even: <ValidatorFunction>(value => +value % 2 === 0),
  odd: <ValidatorFunction>(value => +value % 2 === 1),
  exist: <ValidatorFunction>(value => value !== undefined),
  match: (regex: RegExp) => <ValidatorFunction>(value => value.match && !! value.match(regex)),
  include: (target: any) => <ValidatorFunction>(value => value.includes && value.includes(target)),
  includeRef: (ref: string) => <ValidatorFunction>((value, rawValues) => value.includes && value.includes(resolveRef(ref, rawValues))),
  includeAll: (...targets: any[]) => <ValidatorFunction>(value => {

    if ( ! value.includes ) return false;

    for ( const target of targets ) {

      if ( ! value.includes(target) ) return false;

    }

    return true;

  }),
  in: (target: any) => <ValidatorFunction>(value => target.includes && target.includes(value)),
  inRef: (ref: string) => <ValidatorFunction>((value, rawValues) => {

    const target = resolveRef(ref, rawValues);

    if ( ! target || ! target.includes ) return false;

    return target.includes(value);

  }),
  enum: (enumerator: any) => <ValidatorFunction>(value => Object.values(enumerator).includes(value)),
  date: <ValidatorFunction>(value => DateTime.fromJSDate(new Date(value)).isValid),
  timezone: <ValidatorFunction>(value => !! value && IANAZone.isValidZone(value)),
  or: (...validators: Array<ValidatorFunction|AsyncValidatorFunction>) => {

    return async (value: any, rawValues?: any) => {

      for ( const validator of validators ) {

        const validatorResult = await validator(value, rawValues);

        if ( validatorResult === true ) return true;

      }

      return false;

    };

  },
  empty: <ValidatorFunction>(value => {

    if ( typeof value === 'string' ) return value.length === 0;
    if ( typeof value === 'number' ) return value === 0;
    if ( !! value && typeof value === 'object' && value.constructor === Object ) return Object.keys(value).length === 0;
    if ( !! value && typeof value === 'object' && value.constructor === Array ) return value.length === 0;

    return false;

  }),
  zero: <ValidatorFunction>(value => +value === 0),
  email: <ValidatorFunction>(value => typeof value === 'string' && !! value.match(/^[a-z0-9.\-_]+@[a-z0-9-]+\.[a-z]+$/i)),
  children: (validator: ValidationDefinition|ValidatorFunction|AsyncValidatorFunction, localRefs?: boolean) => {

    return async (value: any, rawValues?: any) => {

      // If value is of type object
      if ( !! value && typeof value === 'object' ) {

        // If object
        if ( value.constructor === Object ) {

          // If validator is a direct function
          if ( typeof validator === 'function' ) return await validator(value, localRefs ? value : rawValues);

          // Otherwise (it's a validation definition object)
          for ( const key in validator ) {

            let keyValidator = validator[key];

            // If key validator is ExecutableValidators, execute it to get a single validator function
            if ( typeof keyValidator !== 'function' ) keyValidator = keyValidator.__exec();

            const keyValidationResult = await keyValidator(value[key], localRefs ? value : rawValues);

            // If validation didn't pass
            if ( keyValidationResult instanceof Error || ! keyValidationResult ) return keyValidationResult;

          }

          // If all keys passed validation
          return true;

        }
        // If array
        else if ( value.constructor === Array ) {

          // Iterate through the array
          for ( const item of value ) {

            // If validator is a direct function
            if ( typeof validator === 'function' ) return await validator(item, localRefs ? item : rawValues);

            // Otherwise (it's a validation definition object)
            if ( ! item || typeof item !== 'object' || item.constructor !== Object ) return false;

            for ( const key in validator ) {

              let keyValidator = validator[key];

              // If key validator is ExecutableValidators, execute it to get a single validator function
              if ( typeof keyValidator !== 'function' ) keyValidator = keyValidator.__exec();

              const keyValidationResult = await keyValidator(item[key], localRefs ? item : rawValues);

              // If validation didn't pass
              if ( keyValidationResult instanceof Error || ! keyValidationResult ) return keyValidationResult;

            }

          }

          // If all keys passed validation
          return true;

        }

      }

      return false;

    };

  }
};

export default validators;
