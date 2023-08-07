"use strict";

/**
 * Module dependenices
 */

import clone from "shallow-clone";
import typeOf from "kind-of";
import isPlainObject from "is-plain-object";

function maybeTypeofError(obj) {
  try {
    const validNames = [
      "Error",
      "TypeError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "EvalError",
      "URIError",
    ];
    if (
      obj &&
      obj.name &&
      validNames.includes(obj.name) &&
      obj.constructor &&
      validNames.includes(obj.constructor.name) &&
      obj.message &&
      obj.stack
    ) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

function cloneError(error1) {
  const error2 = new error1.constructor(error1.message);
  if (error1.stack) {
    error2.stack = error1.stack;
  }
  if (error1.code) {
    error2.code = error1.code;
  }
  if (error1.errno) {
    error2.errno = error1.errno;
  }
  if (error1.syscall) {
    error2.syscall = error1.syscall;
  }
  return error2;
}

function cloneDeep(val, instanceClone) {
  switch (typeOf(val)) {
    case "object":
      return cloneObjectDeep(val, instanceClone);
    case "array":
      return cloneArrayDeep(val, instanceClone);
    case "function":
      return undefined;
    default: {
      if (val instanceof Error || maybeTypeofError(val)) {
        return cloneError(val);
      }
      return clone(val);
    }
  }
}

function cloneObjectDeep(val, instanceClone) {
  if (typeof instanceClone === "function") {
    return instanceClone(val);
  }
  if (instanceClone || isPlainObject(val)) {
    const res = new val.constructor();
    for (let key in val) {
      res[key] = cloneDeep(val[key], instanceClone);
    }
    return res;
  }
  return val;
}

function cloneArrayDeep(val, instanceClone) {
  const res = new val.constructor(val.length);
  for (let i = 0; i < val.length; i++) {
    res[i] = cloneDeep(val[i], instanceClone);
  }
  return res;
}

/**
 * Expose `cloneDeep`
 */

export default cloneDeep;
