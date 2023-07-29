import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { RouterOutputs } from "@/utils/api";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export default function PostView(props: PostWithUser) {
  const { post, author } = props;
  return (
    <div className="relative flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile picture`}
        height={56}
        width={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-2 text-slate-300">
          <Link
            href={`/@${author.username}`}
            className="font-semibold"
          >{`@${author.username}`}</Link>
          <span>·</span>
          <Link href={`/posts/${post.id}`} className="font-thin">
            {dayjs(post.createdAt).fromNow()}
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
}
