import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { privateKeyToAccount } from "viem/accounts";

export async function POST(req: Request) {
  try {
    const account = privateKeyToAccount(
      process.env.WALLET_PRIVATE_KEY as `0x${string}`
    );

    const signer = {
      getAddress: async () => account.address,
      signMessage: async (message: string) => account.signMessage({ message }),
      _signTypedData: async (domain: any, types: any, message: any) =>
        account.signTypedData({
          domain,
          types,
          primaryType: "Mail",
          message,
        }),
    };

    const user = await PushAPI.initialize(signer as any, {
      env: CONSTANTS.ENV.STAGING,
    });

    const channel = await user.channel.create({
      name: "Test Channel",
      description: "This is a test channel for Push Protocol",
      icon: "https://cryptoalerts.com/logo.png",
      url: "https://push.org",
    });

    return Response.json({ success: true, channel });
  } catch (error: any) {
    console.error("Server Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
