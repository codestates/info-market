"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const config_1 = require("../config");
const userDb = __importStar(require("../db/user"));
const adminDb = __importStar(require("../db/admin"));
const jwtToken = require('../controlloers/functions/jwtToken');
module.exports = {
    me: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let token;
        const authHeader = req.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        // console.log(token);
        if (!token) {
            return res
                .status(400)
                .json({ message: 'access Token??? ???????????? ????????????.' });
        }
        yield jwt.verify(token, config_1.config.jwt.secret_key, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                return res.status(400).json({ message: '????????? ??????????????????.' });
            }
            // console.log(decoded);
            // id, grade
            if (decoded.grade === 'admin') {
                const admin = yield adminDb.findAdminByPK(decoded.id);
                if (!admin) {
                    return res
                        .status(400)
                        .json({ message: '????????? ???????????? ????????????.' });
                }
                req.userId = admin.id; // ?????? ????????? ??? ????????? ???????????? ?????? ???????????? ?????? ???????????? ??????
                req.token = token;
                req.grade = admin.grade; // ????????? ???????????? ????????? ????????? ???????????? ??? ??? ???????????? ??????
                next();
            }
            else {
                const user = yield userDb.findPkUser(decoded.id);
                if (!user) {
                    return res
                        .status(400)
                        .json({ message: '????????? ???????????? ????????????.' });
                }
                // console.log(user);
                req.userId = user.id; // ?????? ????????? ??? ????????? ???????????? ?????? ???????????? ?????? ???????????? ??????
                req.token = token;
                req.grade = user.grade; // ????????? ???????????? ????????? ????????? ???????????? ??? ??? ???????????? ??????
                next();
            }
        }));
    }),
    newAcc: (req, res, next) => {
        const refreshToken = req.headers.cookie;
        if (!refreshToken) {
            return res.status(400).json({ message: 'refresh token??? ????????????.' });
        }
        else if (refreshToken === 'refreshtoken= ') {
            return res.status(400).json({
                message: 'refresh token??? ????????????. ?????? ????????? ????????????.',
            });
        }
        const getToken = refreshToken.split('=')[1].split(';')[0];
        console.log(getToken);
        jwt.verify(getToken, config_1.config.jwt.secret_key, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(400).json({ message: '????????? ??????????????????.' });
            }
            console.log(decoded);
            const user = yield userDb.findPkUser(decoded.id);
            // console.log(user);
            if (!user) {
                return res.status(400).json({ message: '????????? ???????????? ????????????.' });
            }
            const { id, grade } = user;
            const accessToken = yield jwtToken.generateAccessToken(id, grade);
            return res.status(200).json({
                accToken: accessToken,
                message: 'accessToken??? ?????? ?????? ???????????????.',
            });
        }));
    },
};
