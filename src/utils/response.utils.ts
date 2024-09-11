import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiProperty,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PagingResponse } from './dto/page.dto';

// Utility type to infer the schema of an object
type ObjectType = Record<string, any>;

// Helper type to determine if a type is a class (constructor function)
type IsClass<T> = T extends new (...args: any[]) => any ? T : never;

export const ApiResponseGeneral = <GenericType extends Type<unknown>>(
  statusCode: number,
  message: string | null,
  data: GenericType | [GenericType] | null = null,
  meta: Type<PagingResponse> | null = null,
) =>
  applyDecorators(
    // If data and meta are provided, they are added to the ApiExtraModels
    ...(Array.isArray(data)
      ? [ApiExtraModels(...(data as [GenericType]))]
      : data
        ? [ApiExtraModels(data)]
        : []),
    ...(meta ? [ApiExtraModels(meta)] : []),
    ApiResponse({
      status: statusCode,
      description: message || '',
      schema: {
        properties: {
          statusCode: {
            type: 'integer',
            example: statusCode,
          },
          message: {
            type: 'string',
            example: message || null,
          },
          data: data
            ? Array.isArray(data)
              ? {
                  type: 'array',
                  items: {
                    $ref: getSchemaPath((data as [GenericType])[0]),
                  },
                }
              : { $ref: getSchemaPath(data as GenericType) }
            : { type: 'null', example: null },
          meta: meta
            ? { allOf: [{ $ref: getSchemaPath(meta) }] }
            : { type: 'null', example: null },
        },
      },
    }),
  );

export const ApiResponseCustom = <
  GenericType extends IsClass<unknown> = IsClass<unknown>,
>(
  statusCode: number,
  message: string | null,
  data:
    | string
    | number
    | null
    | GenericType
    | GenericType[]
    | ObjectType = null,
  meta: IsClass<PagingResponse> | null = null,
) =>
  applyDecorators(
    ...(Array.isArray(data) &&
    data.length > 0 &&
    typeof data[0] !== 'object' &&
    typeof data[0] !== 'string' &&
    typeof data[0] !== 'number'
      ? [ApiExtraModels(...(data as GenericType[]))]
      : data &&
          typeof data !== 'string' &&
          typeof data !== 'number' &&
          'constructor' in data
        ? [ApiExtraModels(data as IsClass<unknown>)]
        : []),
    ...(meta ? [ApiExtraModels(meta as IsClass<unknown>)] : []),
    ApiResponse({
      status: statusCode,
      description: message || '',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: statusCode,
          },
          message: {
            type: 'string',
            example: message || null,
          },
          data: data
            ? typeof data === 'string' || typeof data === 'number'
              ? { type: typeof data, example: data }
              : Array.isArray(data)
                ? {
                    type: 'array',
                    items: {
                      $ref: getSchemaPath((data as GenericType[])[0]),
                    },
                  }
                : {
                    type: 'object',
                    properties: Object.entries(data as ObjectType).reduce(
                      (acc, [key, value]) => {
                        acc[key] = { type: typeof value, example: value };
                        return acc;
                      },
                      {} as Record<string, any>,
                    ),
                  }
            : { type: 'null', example: null },
          meta: meta
            ? { allOf: [{ $ref: getSchemaPath(meta as IsClass<unknown>) }] }
            : { type: 'null', example: null },
        },
      },
    }),
  );

export class ResponseValidation {
  @ApiProperty({ type: Number, default: 400 })
  statusCode: number;

  @ApiProperty({
    type: [String],
    example: ['email should not be empty', 'password should not be empty'],
  })
  message: string[];

  @ApiProperty({ type: String, default: 'Bad Request' })
  error: string;
}

export class ResponseNotFound {
  @ApiProperty({ type: Number, default: 404 })
  statusCode: number;

  @ApiProperty({
    type: String,
    example: 'User not found',
  })
  message: string;

  @ApiProperty({ type: String, default: 'Not Found' })
  error: string;
}

export class ResponseUnauthorized {
  @ApiProperty({ type: Number, default: 401 })
  statusCode: number;

  @ApiProperty({ type: String, default: 'Unauthorized' })
  message: string;
}

export class ResponseServerError {
  @ApiProperty({ type: Number, default: 500 })
  statusCode: number;

  @ApiProperty({ type: String, default: 'Internal Server Error' })
  message: string;
}
