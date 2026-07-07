import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="landing-page">
      <div className="login-card">
        <h1>Create your account</h1>

        <SignUp />
      </div>
    </main>
  );
}