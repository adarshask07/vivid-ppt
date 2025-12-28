// ============================================================================
// ERROR TYPES
// ============================================================================

export type VividErrorCode =
  | "INVALID_PRESENTATION"
  | "INVALID_SLIDE"
  | "INVALID_ELEMENT"
  | "STREAM_ERROR"
  | "STREAM_CANCELLED"
  | "EXPORT_ERROR"
  | "RENDER_ERROR"
  | "THEME_ERROR"
  | "PARSE_ERROR"
  | "UNKNOWN_ERROR";

export class VividError extends Error {
  code: VividErrorCode;
  details?: unknown;
  recoverable: boolean;
  cause?: Error;

  constructor(
    code: VividErrorCode,
    message: string,
    options?: {
      details?: unknown;
      recoverable?: boolean;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = "VividError";
    this.code = code;
    this.details = options?.details;
    this.recoverable = options?.recoverable ?? false;
    this.cause = options?.cause;
  }

  static invalidPresentation(message: string, details?: unknown): VividError {
    return new VividError("INVALID_PRESENTATION", message, { details });
  }

  static invalidSlide(message: string, details?: unknown): VividError {
    return new VividError("INVALID_SLIDE", message, { details });
  }

  static streamError(message: string, cause?: Error): VividError {
    return new VividError("STREAM_ERROR", message, {
      cause,
      recoverable: true,
    });
  }

  static exportError(message: string, cause?: Error): VividError {
    return new VividError("EXPORT_ERROR", message, { cause });
  }
}

// Convenience aliases
export class ParseError extends VividError {
  constructor(message: string, details?: unknown) {
    super("PARSE_ERROR", message, { details });
    this.name = "ParseError";
  }
}

export class RenderError extends VividError {
  constructor(message: string, details?: unknown) {
    super("RENDER_ERROR", message, { details });
    this.name = "RenderError";
  }
}

export class ExportError extends VividError {
  constructor(message: string, cause?: Error) {
    super("EXPORT_ERROR", message, { cause });
    this.name = "ExportError";
  }
}
