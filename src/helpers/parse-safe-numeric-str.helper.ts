import { SafeNumericString } from "@/types/index.types";

function parseSafeNumericString(value: SafeNumericString) {
  return parseInt(value);
}

export { parseSafeNumericString };
