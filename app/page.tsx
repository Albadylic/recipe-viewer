import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xl m-2">
        Welcome to recipe viewer! Upload a picture and get the recipe.
      </p>
      <Link
        href="/generate"
        className=" text-xl bg-green-700 p-4 rounded m-2"
      >{`Let's go!`}</Link>
    </div>
  );
}
