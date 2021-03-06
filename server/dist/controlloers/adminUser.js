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
const userDb = __importStar(require("../db/user"));
const adminDb = __importStar(require("../db/admin"));
const bcrypt = require('../controlloers/functions/bcrypt');
const { generateAccessToken, generateRefreshToken, } = require('./functions/jwtToken');
module.exports = {
    adminSignUp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const exAdmin = yield adminDb.findAdmin(email);
        if (exAdmin) {
            return res.status(409).json({ message: '????????? ?????? ?????????.' });
        }
        const hashPw = yield bcrypt.hash(password).catch((err) => {
            console.log(err);
        });
        const test = yield adminDb.createAdmin(email, hashPw);
        return res.status(201).json({
            id: test.id,
            message: '??????????????? ?????? ????????????.',
        });
    }),
    adminLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const admin = yield adminDb.findAdmin(email);
        // console.log(admin);
        if (!admin) {
            return res.status(401).json({ message: '?????? ????????? ????????????.' });
        }
        const { id, grade } = admin;
        const verification = yield bcrypt
            .comparePw(password, admin.password)
            .catch((err) => {
            console.log(err);
        });
        if (!verification) {
            return res.status(400).json({ message: '??????????????? ???????????? ??????' });
        }
        const accToken = generateAccessToken(id, grade);
        const refreshToken = generateRefreshToken(id, grade);
        const cookieOptions = {
            httpOnly: true,
        };
        return res
            .cookie('refreshToken', refreshToken, cookieOptions)
            .status(201)
            .json({
            id,
            grade,
            accToken: accToken,
            message: '???????????? ?????? ????????????.',
        });
    }),
    adminLogOut: (req, res) => {
        res
            .cookie('refreshToken', '')
            .status(200)
            .json({ message: '??????????????? ??????????????????.' });
    },
    getUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { pages, limit } = req.query;
        const { grade } = req;
        // console.log(grade);
        if (grade !== 'admin') {
            return res.status(403).json({ message: '?????? ????????? ????????????.' });
        }
        const users = yield userDb.findUsers(Number(pages), Number(limit));
        //   .catch(() => {
        //     return res
        //       .status(400)
        //       .json({ message: '?????? ????????? ??????????????? ??????????????????.' });
        //   });
        // console.log(users);
        if (users.count === 0) {
            return res.status(406).json({ message: '????????? ???????????? ????????????.' });
        }
        res.status(200).json({ users, message: '????????? ???????????? ??????????????????.' });
    }),
    editUserInfo: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        if (req.grade !== 'admin') {
            return res.status(403).json({ message: '?????? ????????? ????????????.' });
        }
        const { email, nickname, point, grade } = req.body;
        const user = yield userDb.findPkUser(Number(userId));
        if (!user) {
            return res.status(406).json({ message: '????????? ???????????? ????????????.' });
        }
        yield userDb
            .AdminEditUserInfo(Number(userId), email, nickname, point, grade)
            .catch(() => {
            return res
                .status(400)
                .json({ message: '?????? ????????? ??????????????? ??????????????????.' });
        });
        res.status(200).json({
            message: '?????? ????????? ????????? ?????? ????????????.',
        });
    }),
    removeUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        if (req.grade !== 'admin') {
            return res.status(403).json({ message: '?????? ????????? ????????????.' });
        }
        const user = yield userDb.findPkUser(Number(userId));
        if (!user) {
            return res.status(406).json({ message: '????????? ???????????? ????????????.' });
        }
        yield userDb.removeUser(Number(userId)).catch(() => {
            return res
                .status(400)
                .json({ message: '????????? ?????? ????????? ??????????????????.' });
        });
        res.status(200).json({ message: '?????? ????????? ??????????????????.' });
    }),
};
