import { Validatable } from "@/interfaces/validatable.interface";
import { isString, isSafeNumericString } from "@/types/guards.types";
import { parseSafeNumericString } from "@/helpers/parse-safe-numeric-str.helper";

function validateFormFields(validatableInput: Validatable) {
  let isValid = true;
  let isValidString = isString(validatableInput.value);
  if (validatableInput.required) {
    isValid = isValid && isValidString;
  }

  if (validatableInput.minLength != null) {
    isValidString = isString(
      validatableInput.value,
      validatableInput.minLength
    );
    isValid = isValid && isValidString;
  }

  if (validatableInput.maxLenght != null && isString(validatableInput.value)) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLenght;
  }

  if (
    validatableInput.min != null &&
    isSafeNumericString(validatableInput.value)
  ) {
    const parsedValidatableInputValue = parseSafeNumericString(
      validatableInput.value
    );
    isValid = isValid && parsedValidatableInputValue > validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    isSafeNumericString(validatableInput.value)
  ) {
    const parsedValidatableInputValue = parseSafeNumericString(
      validatableInput.value
    );
    isValid = isValid && parsedValidatableInputValue < validatableInput.max;
  }

  return isValid;
}

export { validateFormFields };
