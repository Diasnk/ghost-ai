import { SignUp } from "@clerk/nextjs";

import { AuthLayout } from "@/components/auth/auth-layout";
import { clerkAppearance } from "@/lib/clerk-appearance";
import {
  clerkSignInUrl,
  clerkSignUpAfterAuthUrl,
  clerkSignUpUrl,
} from "@/lib/clerk-routes";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp
        appearance={clerkAppearance}
        fallbackRedirectUrl={clerkSignUpAfterAuthUrl}
        path={clerkSignUpUrl}
        routing="path"
        signInUrl={clerkSignInUrl}
      />
    </AuthLayout>
  );
}
