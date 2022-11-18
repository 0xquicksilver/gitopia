import { DirectSecp256k1HdWallet, OfflineSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import fs from "node:fs";

const denom = "utlore";
const recipient = "gitopia1ns3vxaum5p5kn8rzeknt4uuepgvs2sd5pe4tq0";

async function createAddress(mnemonic: string): Promise<OfflineSigner> {
	const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
		prefix: "gitopia",
	});
	return wallet;
}

const start = async (mnemonic: string) => {
	const wallet = await createAddress(mnemonic);
	return new Promise(async (resolve) => {
		await sendTransaction(wallet, mnemonic);
		setTimeout(resolve, 0.01 * 1000);
	});
};

async function sendTransaction(wallet: OfflineSigner, m: string) {
	const rpcEndpoint = "tcp://127.0.0.1:26657";
	const client = await SigningStargateClient.connectWithSigner(
		rpcEndpoint,
		wallet
	);
	const [firstAccount] = await wallet.getAccounts();
	const balance = await client.getBalance(firstAccount.address, denom);
	if (balance.amount === "10000000") {
		const mnemonic = JSON.parse(
			fs.readFileSync("m.json", { encoding: "utf-8" })
		);
		fs.writeFileSync("m.json", JSON.stringify([...mnemonic, m]));
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
