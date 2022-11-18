import { DirectSecp256k1HdWallet, OfflineSigner } from "@cosmjs/proto-signing";
import {
	assertIsDeliverTxSuccess,
	SigningStargateClient,
	StdFee,
	calculateFee,
	GasPrice,
	coins,
} from "@cosmjs/stargate";
import fs from "node:fs";

const denom = "utlore";
const recipient = "gitopia1ns3vxaum5p5kn8rzeknt4uuepgvs2sd5pe4tq0";

async function createAddress(mnemonic: string): Promise<OfflineSigner> {
	console.log("sender", mnemonic);
	const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
		prefix: "gitopia",
	});
	return wallet;
}

const start = async (mnemonic: string) => {
	const wallet = await createAddress(mnemonic);
	await sendTransaction(wallet);
};

async function sendTransaction(wallet: OfflineSigner) {
	const rpcEndpoint = "rpc.gitopia.com";
	const client = await SigningStargateClient.connectWithSigner(
		rpcEndpoint,
		wallet
	);
	const [firstAccount] = await wallet.getAccounts();
	const balance = await client.getBalance(firstAccount.address, denom);
	console.log(balance);
	const amount = coins(
		Number(Number(balance.amount) - 20000).toString(),
		denom
	);

	const defaultGasPrice = GasPrice.fromString("0.01utlore");
	const defaultSendFee: StdFee = calculateFee(200000, defaultGasPrice);
	// console.log("transactionFee", defaultSendFee);
	console.log("sender", firstAccount.address);
	const transaction = await client.sendTokens(
		firstAccount.address,
		recipient,
		amount,
		defaultSendFee,
		"Transaction"
	);
	try {
		await new Promise((resolve) => {
			setTimeout(() => {
				assertIsDeliverTxSuccess(transaction);
				console.log(
					"Successfully broadcasted",
					transaction.transactionHash
				);
				resolve;
			}, 30 * 1000);
		});
	} catch (error: any) {
		console.log(error.message);
	}
}

var loopContinue = true;
var n = 0;
async function ManageWork() {
	const mnemonic = JSON.parse(
		fs.readFileSync("mnemonic.txt", { encoding: "utf-8" })
	);
	while (loopContinue) {
		await start(mnemonic[n]);
		n++;
	}
}
ManageWork();
