export const sendResponse = (res: any, statusCode: number, success: boolean, message: string, data: any = null) => {
  res.status(statusCode).json({
    success,
    message,
    data,
  });
};
