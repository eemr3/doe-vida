import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function MatchField(
  field: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'MatchField',
      target: object.constructor,
      propertyName,
      constraints: [field],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [fieldName] = args.constraints;
          const relatedValue = (args.object as any)[fieldName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [fieldName] = args.constraints;
          return `${args.property} must match ${fieldName}`;
        },
      },
    });
  };
}
