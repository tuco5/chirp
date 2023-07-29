import { api } from "@/utils/api";
import Head from "next/head";
import Image from "next/image";
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next/types";
import PageLayout from "@/components/layout";
import LoadingPage from "@/components/loading";
import PostView from "@/components/postview";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";

function ProfileFeed({ userId }: { userId: string }) {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({ userId });

  if (isLoading) return <LoadingPage />;

  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
}

export default function ProfilePage({
  username,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{username}</title>
      </Head>
      <PageLayout>
        <div className="relative mb-16 h-36 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-2 border-slate-400 bg-black"
          />
        </div>
        <div className="w-full border-b border-slate-400">
          <div className="p-4 text-2xl font-bold">@{data.username}</div>
        </div>
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
}

export async function getStaticProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const helpers = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  };
}

export function getStaticPaths() {
  return { paths: [], fallback: false };
}
