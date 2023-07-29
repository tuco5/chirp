import { useState } from "react";
import Image from "next/image";
import { SignIn, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "@/utils/api";
import LoadingPage, { LoadingSpinner } from "@/components/loading";
import toast from "react-hot-toast";
import PageLayout from "@/components/layout";
import PostView from "@/components/postview";

dayjs.extend(relativeTime);

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Return empty div if user isnt' loaded yet
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignIn />
          </div>
        )}
        {isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout>
  );
}

function Feed() {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map(({ post, author }) => (
        <PostView key={post.id} post={post} author={author} />
      ))}
    </div>
  );
}

function CreatePostWizard() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();

  if (!user) return null;

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      void ctx.posts.getAll.invalidate();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors.content;
      console.log("error message", errorMessage);
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      }
    },
    onMutate: () => {
      setInput("");
    },
  });

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input) {
      mutate({ content: input });
    }
  };

  return (
    <div className="relative flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="profile image"
        className="rounded-full"
        height={56}
        width={56}
      />
      <input
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
        type="text"
        onKeyDown={(e) => handleSubmit(e)}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      {isPosting && <LoadingSpinner />}
    </div>
  );
}
