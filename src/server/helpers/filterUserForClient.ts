import type { User } from "@clerk/nextjs/dist/types/server";

export default function filterUserForClient(user: User) {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
}
