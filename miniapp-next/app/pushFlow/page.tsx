"use client";

import { FC, useState } from "react";

const PushFlowTest: FC = () => {
  const [status, setStatus] = useState<string>("");

  const createChannel = async () => {
    try {
      setStatus("Creating channel...");
      const response = await fetch("/api/push", {
        method: "POST",
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setStatus(`Channel created: ${JSON.stringify(data.channel)}`);
    } catch (error: any) {
      console.error("Error:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Push Protocol Test</h1>
      <button
        onClick={createChannel}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Channel
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded">{status}</pre>
    </div>
  );
};

export default PushFlowTest;
