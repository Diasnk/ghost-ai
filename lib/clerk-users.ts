import { clerkClient } from "@clerk/nextjs/server";

export interface ClerkUserProfile {
  displayName: string | null;
  imageUrl: string | null;
}

function buildDisplayName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  username: string | null | undefined
): string | null {
  const fullName = [firstName, lastName]
    .filter((part) => typeof part === "string" && part.trim().length > 0)
    .join(" ")
    .trim();

  if (fullName) {
    return fullName;
  }

  if (typeof username === "string" && username.trim().length > 0) {
    return username.trim();
  }

  return null;
}

export async function getClerkProfilesByEmail(
  emails: string[]
): Promise<Map<string, ClerkUserProfile>> {
  const normalizedEmails = [
    ...new Set(
      emails
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email.length > 0)
    ),
  ];

  const profiles = new Map<string, ClerkUserProfile>();

  if (normalizedEmails.length === 0) {
    return profiles;
  }

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({
    emailAddress: normalizedEmails,
    limit: normalizedEmails.length,
  });

  for (const user of users) {
    const profile: ClerkUserProfile = {
      displayName: buildDisplayName(
        user.firstName,
        user.lastName,
        user.username
      ),
      imageUrl: user.imageUrl ?? null,
    };

    for (const emailAddress of user.emailAddresses) {
      const normalizedEmail = emailAddress.emailAddress.trim().toLowerCase();
      profiles.set(normalizedEmail, profile);
    }
  }

  return profiles;
}

export interface ClerkUserIdentity {
  email: string | null;
  displayName: string | null;
  imageUrl: string | null;
}

export async function getClerkProfileByUserId(
  userId: string
): Promise<ClerkUserIdentity> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const primaryEmail =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      null;

    return {
      email: primaryEmail ? primaryEmail.trim().toLowerCase() : null,
      displayName: buildDisplayName(
        user.firstName,
        user.lastName,
        user.username
      ),
      imageUrl: user.imageUrl ?? null,
    };
  } catch {
    return {
      email: null,
      displayName: null,
      imageUrl: null,
    };
  }
}
