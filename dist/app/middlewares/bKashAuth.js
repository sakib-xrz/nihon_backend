"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const node_global_storage_1 = require("node-global-storage");
const config_1 = __importDefault(require("../config"));
const bkashAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear existing id_token from global storage
        (0, node_global_storage_1.unsetValue)('id_token');
        // Make request to obtain id_token
        const { data } = yield axios_1.default.post(config_1.default.bkash.grant_token_url, {
            app_key: config_1.default.bkash.api_key,
            app_secret: config_1.default.bkash.secret_key,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                username: config_1.default.bkash.username,
                password: config_1.default.bkash.password,
            },
        });
        (0, node_global_storage_1.setValue)(`id_token`, data === null || data === void 0 ? void 0 : data.id_token, { protected: true });
        next();
    }
    catch (error) {
        // Handle authentication error
        res.status(401).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || 'Unauthorized',
        });
    }
});
exports.default = bkashAuth;
