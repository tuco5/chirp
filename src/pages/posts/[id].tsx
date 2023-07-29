import { api } from "@/utils/api";
import Head from "next/head";
import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next/types";
import PageLayout from "@/components/layout";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import PostView from "@/components/postview";

export default function SinglePostPage({
  id,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const { data } = api.posts.getByID.useQuery({
    id,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
}

export async function getStaticProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const helpers = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no no no");

  await helpers.posts.getByID.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
}

export function getStaticPaths() {
  return { paths: [], fallback: false };
}
