"use client";
import { useSession } from "next-auth/react";

export default function PushFlow() {
  const { data: session } = useSession();

  console.log("PushFlow rendering");

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <h1 className="text-4xl font-bold">
        HelloHelloHelloHelloHelloHelloHelloHelloHello
      </h1>
    </div>
  );
}
