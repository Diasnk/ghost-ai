import { SignIn } from "@clerk/nextjs";

import { AuthLayout } from "@/components/auth/auth-layout";
import { clerkAppearance } from "@/lib/clerk-appearance";
import {
  clerkAfterAuthUrl,
  clerkSignInUrl,
  clerkSignUpUrl,
} from "@/lib/clerk-routes";

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn
        appearance={clerkAppearance}
        fallbackRedirectUrl={clerkAfterAuthUrl}
        path={clerkSignInUrl}
        routing="path"
        signUpUrl={clerkSignUpUrl}
      />
    </AuthLayout>
  );
}
