import { SafeNumericString } from "@/types/index.types";

function isSafeNumericString(value: any): value is SafeNumericString {
  return typeof value === "string" && !isNaN(Number(value));
}

function isArray<T>(value: any): value is Array<T> {
  return Array.isArray(value);
}

function isString(value: any, minLength?: number): value is string;
function isString(value: any, minLength: number = 0): value is string {
  return typeof value === "string" && value.trim().length > minLength;
}

export { isSafeNumericString, isArray, isString };
