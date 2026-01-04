"use client";

import Link from "next/link";
import Image from "next/image";
import avatar from "../../../public/avatar.png";

export default function Profile() {
  return (
    <Link
      href="/login"
      className="w-8 h-8 rounded-md bg-white/20 overflow-hidden ml-1 border border-white/30 cursor-pointer"
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
