import { useRouter } from "next/router";
import Modal from "react-modal";
import cls from "classnames";

import styles from "../../styles/video.module.css";
import { getYouTubeVideoById } from "../../../lib/videos";
import NavBar from "../../../components/NavBar/NavBar";

Modal.setAppElement("#__next");
export default function Video({ video }) {
  const router = useRouter();

  const { channelTitle, desc, publishTime, title, videoCount } = video;

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Watch video">
        <iframe
          className={styles.videoPlayer}
          id="ytplayer"
          type="text/html"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${router.query.videoId}?autoplay=0&controls=0&rel=0&modestbranding=0&origin=http://example.com`}
          frameBorder="0"></iframe>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.text}>{title}</p>
              <p className={styles.description}>{desc}</p>
            </div>
            <div className={styles.col2}>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast:</span>
                <span className={styles.channelTitle}> {channelTitle}</span>
              </p>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count:</span>
                <span className={styles.channelTitle}> {videoCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const videoArray = await getYouTubeVideoById(`${params.videoId}`);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {}
    },
    revalidate: 10
  };
}

export async function getStaticPaths() {
  const listOfVideoId = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];

  const paths = listOfVideoId.map((id) => ({
    params: { videoId: id }
  }));

  return { paths, fallback: "blocking" };
}
