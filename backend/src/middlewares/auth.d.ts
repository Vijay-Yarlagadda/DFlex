export declare const clerkAuth: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const requireUserAuth: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
declare global {
    namespace Express {
        interface Request {
            auth: {
                userId: string;
                sessionId: string;
            };
        }
    }
}
//# sourceMappingURL=auth.d.ts.map