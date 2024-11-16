"use client";

import { FC, useEffect, useState } from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { privateKeyToAccount } from "viem/accounts";

// Only the interfaces we actually need
interface ProgressHookType {
  progressId: string;
  progressTitle: string;
  progressInfo: string;
  level: string;
}

const account = privateKeyToAccount(
  process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY as `0x${string}`
);

const PushFlowTest: FC = () => {
  const [user, setUser] = useState<PushAPI | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const initializePush = async () => {
      try {
        const signer = {
          getAddress: async () => account.address,
          signMessage: async (message: string) =>
            account.signMessage({ message }),
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
        setUser(user);
        setStatus("Ready to create channel");
      } catch (error) {
        console.error("Failed to initialize Push:", error);
        setStatus("Failed to initialize Push Protocol");
      }
    };

    initializePush();
  }, []);

  const createChannel = async () => {
    if (!user) return;

    try {
      setStatus("Creating channel...");
      const response = await user.channel.create({
        name: "Test Channel",
        description: "This is a test channel for Push Protocol",
        icon: "https://cryptoalerts.com/logo.png",
        url: "https://push.org",
        progressHook: (progress: ProgressHookType) => {
          console.log("Progress:", progress);
          setStatus(`${progress.progressTitle}: ${progress.progressInfo}`);
        },
      });

      console.log("Channel creation response:", response);
      setStatus(`Channel created: ${JSON.stringify(response)}`);
    } catch (error: any) {
      console.error("Error creating channel:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Push Protocol Test</h1>
      <button
        onClick={createChannel}
        disabled={!user}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Channel
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded">{status}</pre>
    </div>
  );
};

export default PushFlowTest;
