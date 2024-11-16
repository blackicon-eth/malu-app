"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { shortenAddress } from "@/lib/utils";
import Link from "next/link";

export const SignIn = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="flex flex-col gap-3">
        <p>Signed in as {session?.user?.name ? shortenAddress(session.user.name) : ""} </p>
        <Button className="bg-red-600 rounded-lg py-2" onClick={() => signOut()}>
          Sign out
        </Button>
        <Button className="rounded-lg py-2">
          <Link href="/events">Launch App!</Link>
        </Button>
      </div>
    );
  } else {
    return (
      <Button className="bg-green-600 rounded-lg py-2" onClick={() => signIn()}>
        Sign in!
      </Button>
    );
  }
};
