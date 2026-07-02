"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dietController_1 = require("../controllers/dietController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/generate-diet', auth_1.requireUserAuth, dietController_1.generateDiet);
router.get('/diet/:id', auth_1.requireUserAuth, dietController_1.getDiet);
router.put('/profile', auth_1.requireUserAuth, dietController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=dietRoutes.js.map