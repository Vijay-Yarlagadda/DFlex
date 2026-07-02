"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireUserAuth = exports.clerkAuth = void 0;
const express_1 = require("@clerk/express");
const express_2 = require("express");
exports.clerkAuth = (0, express_1.clerkMiddleware)();
exports.requireUserAuth = (0, express_1.requireAuth)();
//# sourceMappingURL=auth.js.map