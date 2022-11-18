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
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_1 = require("@cosmjs/stargate");
const node_fs_1 = __importDefault(require("node:fs"));
const denom = "utlore";
const recipient = "gitopia1ns3vxaum5p5kn8rzeknt4uuepgvs2sd5pe4tq0";
function createAddress(mnemonic) {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
            prefix: "gitopia",
        });
        return wallet;
    });
}
const start = (mnemonic) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield createAddress(mnemonic);
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        yield sendTransaction(wallet, mnemonic);
        setTimeout(resolve, 0.01 * 1000);
    }));
});
function sendTransaction(wallet, m) {
    return __awaiter(this, void 0, void 0, function* () {
        const rpcEndpoint = "https://rpc.gitopia.com";
        const client = yield stargate_1.SigningStargateClient.connectWithSigner(rpcEndpoint, wallet);
        const [firstAccount] = yield wallet.getAccounts();
        const balance = yield client.getBalance(firstAccount.address, denom);
        console.log(balance.amount);
        if (balance.amount === "10000000") {
            const mnemonic = JSON.parse(node_fs_1.default.readFileSync("m.json", { encoding: "utf-8" }));
            node_fs_1.default.writeFileSync("m.json", JSON.stringify([...mnemonic, m]));
        }
    });
}
var loopContinue = true;
var n = 0;
function ManageWork() {
    return __awaiter(this, void 0, void 0, function* () {
        const mnemonic = JSON.parse(node_fs_1.default.readFileSync("mnemonic.txt", { encoding: "utf-8" }));
        while (loopContinue) {
            yield start(mnemonic[n]);
            n++;
        }
    });
}
ManageWork();
