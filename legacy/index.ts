import { ValidatorFunction, resolveRef } from '@singular/common';

export interface SyncValidationDefinition {

  [key: string]: ValidatorFunction;

}

/**
* Type checks.
*/
export namespace type {

  /**
  * String type comparison.
  */
  export function String(value: any): boolean { return typeof value === 'string' }
  /**
  * Number type comparison.
  */
  export function Number(value: any): boolean { return typeof value === 'number'; }
  /**
  * Boolean type comparison.
  */
  export function Boolean(value: any): boolean { return typeof value === 'boolean'; }
  /**
  * Null type comparison.
  */
  export function Null(value: any): boolean { return value === null; }
  /**
  * Array type comparison.
  * @param validator      A validator to apply to all items inside the array.
  * @param arrayValidator A validator to apply to the whole array (e.g. len.min).
  */
  export function Array(validator?: ValidatorFunction, arrayValidator?: ValidatorFunction): ValidatorFunction {

    return (value: any): boolean|Error => {

      if ( ! value || typeof value !== 'object' || value.constructor !== Array ) return false;

      if ( validator ) {

        for ( const item of value ) {

          const result = validator(item);

          if ( result === false ) return false;
          if ( result instanceof Error ) return result;

        }

      }

      if ( arrayValidator ) {

        return arrayValidator(value);

      }

      return true;

    };

  }
  /**
  * Enum type comparison.
  * @param enumerator An enumerator to validate the value against.
  */
  export function Enum(enumerator: any): ValidatorFunction {

    return (value: any): boolean => {

      return Object.values(enumerator).includes(value);

    };

  }

}

/**
* Equality comparison.
*/
export function equal(val: any): ValidatorFunction {

  return (value: any): boolean => {

    return value === val;

  };

}

/**
* Equality comparison with value from reference.
*/
export function equalRef(ref: string): ValidatorFunction {

  return (value: any, rawValues: any): boolean => {

    return value === resolveRef(ref, rawValues);

  };

}

/**
* Validates a string against a given regular expression.
* @param validators A rest argument of validators.
*/
export function match(regex: RegExp): ValidatorFunction {

  return (value: any): boolean => {

    return typeof value === 'string' && !! value.match(regex);

  };

}

/**
* Validates an object against the given validation definition object (useful for validating arrays of objects).
* @param validationDefinition A validation definition object.
* @param localRefs Determines if references should be resolved from the target value or the original raw values object.
*/
export function sub(validationDefinition: SyncValidationDefinition, localRefs?: boolean): ValidatorFunction {

  return (value: any, rawValues?: any): boolean => {

    if ( ! value || typeof value !== 'object' || value.constructor !== Object ) return false;

    for ( const key of Object.keys(validationDefinition) ) {

      if ( ! value.hasOwnProperty(key) || ! validationDefinition[key](value[key], localRefs ? value : rawValues) ) return false;

    }

    return true;

  };

}

/**
* ORs all given validators.
* @param validators A rest argument of validators.
*/
export function or(...validators: Array<ValidatorFunction>): ValidatorFunction {

  return (value: any, rawValues?: any): boolean|Error => {

    let orCheck: boolean = false;

    for ( const validator of validators ) {

      const result = validator(value, rawValues);

      orCheck = orCheck || (typeof result === 'boolean' ? result : false);

    }

    return orCheck;

  };

}

/**
* ANDs all given validators.
* @param validators A rest argument of validators.
*/
export function and(...validators: Array<ValidatorFunction>): ValidatorFunction {

  return (value: any, rawValues?: any): boolean|Error => {

    for ( const validator of validators ) {

      const result = validator(value, rawValues);

      if ( result === false ) return false;
      if ( result instanceof Error ) return result;

    }

    return true;

  };

}

/**
* Negates all given validators.
* @param validators A rest argument of validators.
*/
export function not(validator: ValidatorFunction): ValidatorFunction {

  return (value: any, rawValues?: any): boolean|Error => {

    const result = validator(value, rawValues);

    return result !== true;

  };

}

/**
* Makes the given validator optional (e.g. property may not exist but if it does...).
* @param validator A validator.
*/
export function opt(validator: ValidatorFunction): ValidatorFunction {

  return (value: any, rawValues?: any): boolean|Error => {

    return value === undefined ? true : validator(value, rawValues);

  };

}

/**
* Checks if value includes the given value.
*/
export function include(val: any): ValidatorFunction {

  return (value: any): boolean|Error => {

    return value.includes && value.includes(val);

  };

}

/**
* Checks if value includes the given value by reference.
*/
export function includeRef(ref: string): ValidatorFunction {

  return (value: any, rawValues: any): boolean|Error => {

    return value.includes && value.includes(resolveRef(ref, rawValues));

  };

}

/**
* Checks if value exists.
*/
export function exist(value: any): boolean|Error {

  return value !== undefined;

}

/** Casts to number and... */
export namespace num {

  /**
  * The value must be within the given range (inclusive).
  */
  export function between(min: number, max: number): ValidatorFunction {

    return (value: any): boolean => {

      return +value >= min && +value <= max;

    };

  }

  /**
  * The value must be within the given range (exclusive).
  */
  export function betweenEx(min: number, max: number): ValidatorFunction {

    return (value: any): boolean => {

      return +value > min && +value < max;

    };

  }

  /**
  * The value must be greater than the given number.
  */
  export function gt(val: number): ValidatorFunction {

    return (value: any): boolean => {

      return +value > val;

    };

  }

  /**
  * The value must be greater than or equal to the given number.
  */
  export function gte(val: number): ValidatorFunction {

    return (value: any): boolean => {

      return +value >= val;

    };

  }

  /**
  * The value must be less than the given number.
  */
  export function lt(val: number): ValidatorFunction {

    return (value: any): boolean => {

      return +value < val;

    };

  }

  /**
  * The value must be less than or equal to the given number.
  */
  export function lte(val: number): ValidatorFunction {

    return (value: any): boolean => {

      return +value <= val;

    };

  }

  /**
  * The value must be greater than the given value by reference.
  */
  export function gtRef(ref: string): ValidatorFunction {

    return (value: any, rawValues: any): boolean => {

      return +value > +resolveRef(ref, rawValues);

    };

  }

  /**
  * The value must be greater than or equal to the given value by reference.
  */
  export function gteRef(ref: string): ValidatorFunction {

    return (value: any, rawValues: any): boolean => {

      return +value >= +resolveRef(ref, rawValues);

    };

  }

  /**
  * The value must be less than the given value by reference.
  */
  export function ltRef(ref: string): ValidatorFunction {

    return (value: any, rawValues: any): boolean => {

      return +value < +resolveRef(ref, rawValues);

    };

  }

  /**
  * The value must be less than or equal to the given value by reference.
  */
  export function lteRef(ref: string): ValidatorFunction {

    return (value: any, rawValues: any): boolean => {

      return +value <= +resolveRef(ref, rawValues);

    };

  }

}

/** Checks length of value. */
export namespace len {

  /**
  * The length of value must be within the given range (inclusive).
  */
  export function between(min: number, max: number): ValidatorFunction {

    return (value: any): boolean => {

      return value.length >= min && value.length <= max;

    };

  }

  /**
  * The length of value must be within the given range (exclusive).
  */
  export function betweenEx(min: number, max: number): ValidatorFunction {

    return (value: any): boolean => {

      return value.length > min && value.length < max;

    };

  }

  /**
  * The length of value must be greater than the given number.
  */
  export function gt(val: number): ValidatorFunction {

    return (value: any): boolean => {

      return value.length > val;

    };

  }

  /**
  * The length of value must be greater than or equal to the given number.
  */
  export function gte(val: number): ValidatorFunction {

    return (value: any): boolean => {

      return value.length >= val;

    };

  }

  /**
  * The length of value must be less than the given number.
  */
  export function lt(val: number): ValidatorFunction {

    return (value: any): boolean => {

      return value.length < val;

    };

  }

  /**
  * The length of value must be less than or equal to the given number.
  */
  export function lte(val: number): ValidatorFunction {

    return (value: any): boolean => {

      return value.length <= val;

    };

  }

  /**
  * The length of value must be greater than the given value by reference.
  */
  export function gtRef(ref: string): ValidatorFunction {

    return (value: any, rawValues: any): boolean => {

      return value.length > +resolveRef(ref, rawValues);

    };

  }

  /**
  * The length of value must be greater than or equal to the given value by reference.
  */
  export function gteRef(ref: string): ValidatorFunction {

    return (value: any, rawValues: any): boolean => {

      return value.length >= +resolveRef(ref, rawValues);

    };

  }

  /**
  * The length of value must be less than the given value by reference.
  */
  export function ltRef(ref: string): ValidatorFunction {

    return (value: any, rawValues: any): boolean => {

      return value.length < +resolveRef(ref, rawValues);

    };

  }

  /**
  * The length of value must be less than or equal to the given value by reference.
  */
  export function lteRef(ref: string): ValidatorFunction {

    return (value: any, rawValues: any): boolean => {

      return value.length <= +resolveRef(ref, rawValues);

    };

  }

}
