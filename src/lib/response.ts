import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorDetails {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetails;
}

export function apiSuccess<T>(data: T, message: string = "Success", status: number = 200) {
  return NextResponse.json<ApiSuccessResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function apiError(code: string, message: string, status: number = 400, details?: unknown) {
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
    { status }
  );
}
