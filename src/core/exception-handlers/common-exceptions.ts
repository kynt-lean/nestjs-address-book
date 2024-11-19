export class ValidationException extends Error {
  readonly errors: string[];
  readonly outputDetail: boolean = false;

  constructor(errors: string[], outputDetail?: boolean) {
    super(
      outputDetail ? errors.toString() : 'The data provided failed validation.',
    );
    this.errors = errors;
    if (outputDetail) this.outputDetail = true;
  }
}

export class PermissionException extends Error {
  readonly permission: string;
  readonly outputPermission: boolean = false;

  constructor(detail: {
    message?: string;
    permission: string;
    outputPermission?: boolean;
  }) {
    const { message, permission, outputPermission } = detail;
    super(
      message
        ? message
        : `Permission is required${outputPermission ? ': ' + permission : ''}.`,
    );
  }
}

export class ResourceNotFoundException extends Error {
  readonly resource: string;

  constructor(detail: { message?: string; resource: string }) {
    const { message, resource } = detail;
    super(message ? message : `Resource not found: ${resource}.`);
  }
}

export class BusinessException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DataQueryException extends Error {
  constructor(message: string) {
    super(message);
  }
}
