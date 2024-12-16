import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>Welcome to recipe viewer! Upload a picture and get the recipe.</p>
      <Link href="/generate">{`Let's go!`}</Link>
    </div>
  );
}
