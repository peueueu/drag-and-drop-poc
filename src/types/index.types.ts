type SafeNumericString = "string";

type FormInputElement = {
  [key in
    | "titleInputElement"
    | "descriptionInputElement"
    | "peopleInputElement"]: HTMLInputElement;
};

type Listener<T> = (items: T[]) => void;

export { SafeNumericString, FormInputElement, Listener };
