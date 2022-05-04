"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const usersControllers = require('../controlloers/users');
const auth = require('../middlewares/auth');
router.get('/:userId', auth.me, usersControllers.getUsersInfo);
router.put('/:userId', auth.me, usersControllers.editUsersInfo);
router.get('/info', auth.me, usersControllers.usersWriteInfo);
router.get('/info/order', auth.me, usersControllers.usersOrderInfo);
router.get('/info/refund', auth.me, usersControllers.usersRefundInfo);
module.exports = router;
