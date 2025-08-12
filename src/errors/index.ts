import { Response } from "express";

export function badRequestStatus(res: Response, message?: string) {
  return res.status(400).json({
    message: message || "It was not possible to procced.",
  });
}

export function unauthorizedStatus(res: Response, message?: string) {
  return res.status(401).json({
    message: message || `Access Denied.`,
  });
}

export function notFoundStatus(res: Response, message?: string) {
  return res.status(404).json({
    message: message || "Not found.",
  });
}

export function alredyExistsStatus(res: Response, name: string) {
  return res.status(409).json({
    message: `This ${name} already exists.`,
  });
}

export function internalServerErrorStatus(res: Response, err?: Error) {
  return res.status(500).json({
    message: err?.message || `An error has occurred.`,
  });
}
