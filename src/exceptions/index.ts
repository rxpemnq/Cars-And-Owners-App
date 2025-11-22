import { HttpException, HttpStatus } from '@nestjs/common'

export class ValidationPipeException extends HttpException {
  constructor(
    private readonly validationError: { message: string; errors: any[] }
  ) {
    super(validationError, HttpStatus.BAD_REQUEST)
  }

  getResponse(): string | object {
    const details = this.validationError.errors.flatMap((detail) =>
      detail.errors.map((error) => ({
        field: detail.field,
        message: error
      }))
    )

    return {
      error: 'Validation failed',
      statusCode: HttpStatus.BAD_REQUEST,
      details: details[0]
    }
  }
}
