"use client";
import { Button } from "@/components/ui/button";
import { initUser, createGroup, joinGroup, sendMessage } from "@/lib/push";
import { useSession } from "next-auth/react";
import { ethers } from "ethers";
import { useState } from "react";

export default function PushTest() {
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const chatId: string =
    "659201e337e86c2ccc21ad81c4d88633d2619793c065d6367cdd5a0cadee20fa";

  const getPushUser = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_PUSH_PRIVATE_KEY) {
        throw new Error("Private key not found in environment");
      }
      const signer = new ethers.Wallet(
        process.env.NEXT_PUBLIC_PUSH_PRIVATE_KEY
      );
      const { pushUser } = await initUser(signer);
      if (!pushUser) throw new Error("Failed to initialize Push user");
      return pushUser;
    } catch (err) {
      console.error(
        "Get signer error:",
        err instanceof Error ? err.message : "Unknown error"
      );
      return null;
    }
  };

  const testCreateChat = async () => {
    const pushUser = await getPushUser();
    if (!pushUser) return;
    const group = await createGroup(pushUser, "Test Event Chat");
    console.log("Created group with id:", group.chatId);
  };

  const testJoinChat = async () => {
    const pushUser = await getPushUser();
    if (!pushUser) return;
    if (!session?.user?.name) return;
    const group = await joinGroup(
      pushUser,
      chatId,
      session?.user?.name?.toString()
    );
    console.log("Joined group with id:", chatId);
  };

  const testSendMessage = async () => {
    if (!message.trim()) return;
    const pushUser = await getPushUser();
    if (!pushUser) return;
    sendMessage(pushUser, chatId, message);
  };

  return (
    <div className="p-20">
      <h1>Test create event chat</h1>
      <Button onClick={testCreateChat}>Create Event Chat</Button>
      <h1>Test send message</h1>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="border p-2 rounded"
        />
        <Button onClick={testSendMessage}>Send Message</Button>
      </div>
    </div>
  );
}
