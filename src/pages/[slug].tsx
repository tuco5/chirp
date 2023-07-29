import { api } from "@/utils/api";
import Head from "next/head";
import Image from "next/image";

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
      </PageLayout>
    </>
  );
}

import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import SuperJSON from "superjson";
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next/types";
import PageLayout from "@/components/layout";

export async function getStaticProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON,
  });

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
