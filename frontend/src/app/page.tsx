import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/pages/dashboard">Go to Dashboard</Link><br></br>
      <Link href="/pages/documents">Go to Documents</Link><br></br>
      <Link href="/pages/settings">Go to Settings</Link><br></br>
      <Link href="/pages/upload">Go to Upload</Link>
    </main>
  );
}
