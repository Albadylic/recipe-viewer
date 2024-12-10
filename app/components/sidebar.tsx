import Link from "next/link";
export default function Sidebar() {
  return (
    <nav className="w-1/4 h-screen">
      <ul className="h-screen flex flex-col justify-evenly items-center">
        <li className="bg-slate-700 shadow rounded p-3">
          <Link href="/upload">Upload</Link>
        </li>
        <li className="bg-slate-700 shadow rounded p-3">
          <Link href="/characters">Characters</Link>
        </li>
        <li className="bg-slate-700 shadow rounded p-3">
          <Link href="/madlib">Mad lib</Link>
        </li>
        <li className="bg-slate-700 shadow rounded p-3">
          <Link href="/generate">Generate</Link>
        </li>
      </ul>
    </nav>
  );
}
