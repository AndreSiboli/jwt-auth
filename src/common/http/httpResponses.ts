import { Response } from "express";

type Property = Record<string | number | symbol, unknown>;

export const httpResponses = {
  // 2xx - Success
  ok: <T extends Property>(
    res: Response,
    options?: { data?: T; message?: string }
  ) =>
    res.status(200).json({
      success: true,
      message: options?.message || "Ok",
      ...(typeof options?.data === "object" && { data: options.data }),
    }),

  created: <T extends Property>(
    res: Response,
    options?: { data?: T; message?: string }
  ) =>
    res.status(201).json({
      success: true,
      message: options?.message || "Created",
      ...(typeof options?.data === "object" && { data: options?.data }),
    }),

  accepted: <T extends Property>(
    res: Response,
    options?: { data?: T; message?: string }
  ) =>
    res.status(202).json({
      success: true,
      message: options?.message || "Accepted",
      ...(typeof options?.data === "object" && { data: options.data }),
    }),

  // 4xx - Client Errors
  badRequest: (res: Response, message?: string) =>
    res.status(400).json({
      sucess: false,
      message: message || "Bad Request.",
    }),

  unauthorized: (res: Response, message?: string) =>
    res.status(401).json({
      sucess: false,
      message: message || "Access Denied.",
    }),

  paymentRequired: (res: Response, message?: string) =>
    res.status(402).json({
      sucess: false,
      message: message || "Payment Required.",
    }),

  forbidden: (res: Response, message?: string) =>
    res.status(403).json({
      sucess: false,
      message: message || "You do not have permission to access this resource.",
    }),

  notFound: (res: Response, message?: string) =>
    res.status(404).json({
      sucess: false,
      message: message || "Not Found.",
    }),

  methodNotAllowed: (res: Response, message?: string) =>
    res.status(405).json({
      sucess: false,
      message: message || "Method Not Allowed.",
    }),

  conflict: (res: Response, message?: string) =>
    res.status(409).json({
      sucess: false,
      message: message || "Conflict.",
    }),

  tooManyRequests: (res: Response, message?: string) =>
    res.status(429).json({
      sucess: false,
      message: message || "Too Many Requests. Please try again later.",
    }),

  // 5xx - Server Errors
  internal: (res: Response, message?: string) =>
    res.status(500).json({
      sucess: false,
      message: message || "An internal server error occurred.",
    }),

  notImplemented: (res: Response, message?: string) =>
    res.status(501).json({
      sucess: false,
      message: message || "Not Implemented.",
    }),

  badGateway: (res: Response, message?: string) =>
    res.status(502).json({
      sucess: false,
      message: message || "Bad Gateway.",
    }),

  serviceUnavailable: (res: Response, message?: string) =>
    res.status(503).json({
      sucess: false,
      message: message || "Service Unavailable.",
    }),

  gatewayTimeout: (res: Response, message?: string) =>
    res.status(504).json({
      sucess: false,
      message: message || "Gateway Timeout.",
    }),
};
