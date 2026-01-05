"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import avatar from "../../../public/avatar.png";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-md bg-white/10 animate-pulse ml-1" />
    );
  }

  if (status === "authenticated" && session.user) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-md bg-white/20 overflow-hidden ml-1 border border-white/30 cursor-pointer group relative"
          onClick={() => {
            if (confirm("Do you want to sign out?")) {
              signOut();
            }
          }}
        >
          <Image
            src={session.user.image || avatar}
            alt="Profile"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-[8px] text-white font-bold">OUT</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="w-8 h-8 rounded-md bg-white/20 overflow-hidden ml-1 border border-white/30 cursor-pointer flex items-center justify-center"
    >
      <Image
        src={avatar}
        alt="Profile"
        width={32}
        height={32}
        className="w-full h-full object-cover"
      />
    </Link>
  );
}
