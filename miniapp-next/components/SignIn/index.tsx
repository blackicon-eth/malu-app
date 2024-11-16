"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session?.user?.name?.slice(0, 10)} <br />
        <button className="flex justify-center items-center px-4 py-2 bg-gray-400 rounded-lg" onClick={() => signOut()}>
          Sign out
        </button>
      </>
    );
  } else {
    return (
      <>
        Not signed in <br />
        <button className="flex justify-center items-center px-4 py-2 bg-gray-400 rounded-lg" onClick={() => signIn()}>
          Sign in
        </button>
      </>
    );
  }
};
