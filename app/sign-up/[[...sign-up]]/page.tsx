import { SignUp } from "@clerk/nextjs";

import { AuthLayout } from "@/components/auth/auth-layout";
import { clerkAppearance } from "@/lib/clerk-appearance";
import {
  clerkAfterAuthUrl,
  clerkSignInUrl,
  clerkSignUpUrl,
} from "@/lib/clerk-routes";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp
        appearance={clerkAppearance}
        fallbackRedirectUrl={clerkAfterAuthUrl}
        path={clerkSignUpUrl}
        routing="path"
        signInUrl={clerkSignInUrl}
      />
    </AuthLayout>
  );
}
