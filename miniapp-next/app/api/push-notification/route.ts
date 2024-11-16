import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { sepolia } from "viem/chains";

export async function POST(req: Request) {
  try {
    // Step 1: Setup Alchemy Provider
    console.log("1. Setting up Alchemy Provider...");
    const transport = http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    );
    console.log("1. Transport created:", transport);

    console.log("1.5. Creating Public Client...");
    const publicClient = createPublicClient({
      chain: sepolia,
      transport,
    });
    console.log("1.5. Public Client created:", publicClient);

    // Step 2: Create Viem Account from Private Key
    console.log("2. Creating Viem Account...");
    const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as Hex);
    console.log("2. Account created:", account);

    // Step 3: Setup Viem Wallet Client
    console.log("3. Setting up Viem Wallet Client...");
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport,
    });
    console.log(
      "3. Wallet Client created. walletClient.account:",
      walletClient.account
    );

    // Step 4: Create Push Protocol Compatible Signer
    console.log("4. Creating Push Protocol Compatible Signer...");
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
      sendTransaction: (tx: any) => walletClient.sendTransaction(tx),
      provider: publicClient,
    };
    console.log("4. Signer created:", signer);

    // Step 5: Initialize Push Protocol SDK
    console.log("5. Initializing Push Protocol SDK...");
    const user = await PushAPI.initialize(signer as any, {
      env: CONSTANTS.ENV.STAGING,
    });
    console.log(
      "5. Push Protocol SDK initialized. user.account:",
      user.account
    );

    // Step 6: Create Push Channel
    console.log("6. Creating Push Channel...");
    const channel = await user.channel.create({
      name: "Test Channel",
      description: "This is a test channel for Push Protocol",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC",
      url: "https://push.org",
    });
    console.log("6. Channel created:", channel);

    // Step 7: Return Success Response
    console.log("7. Returning Success Response...");
    const response = { success: true, channel };
    console.log("7. Response:", response);
    return Response.json(response);
  } catch (error: any) {
    console.error("Server Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
