import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Log In</h1>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Log In with Google
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <a href="/register" className="underline">
          Register
        </a>
      </p>
    </div>
  );
}
