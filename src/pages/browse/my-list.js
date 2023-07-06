import Head from "next/head";

import redirectUser from "/utils/redirectUser";
import { getMyLikeVideos } from "/lib/videos";

import NavBar from "/components/NavBar/NavBar";
import CardSlider from "/components/CardSlider/CardSlider";

import styles from "@/styles/MyList.module.css";

export default function myList({ likeVideos }) {
  return (
    <>
      <Head>
        <title>favorite video</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <CardSlider title={"My List"} videos={likeVideos} size="small" isWrap isHover={false} />
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { token, userId } = await redirectUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false
      }
    };
  }

  const likeVideos = await getMyLikeVideos(token, userId);

  return { props: { likeVideos } };
};
