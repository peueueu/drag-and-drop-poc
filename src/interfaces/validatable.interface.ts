interface Validatable {
  value: string;
  required?: boolean;
  minLength?: number;
  maxLenght?: number;
  min?: number;
  max?: number;
}

export { Validatable };
