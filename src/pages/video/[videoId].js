import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import cls from "classnames";

import NavBar from "components/NavBar/NavBar";
import LikeIcon from "components/icons/LikeIcon";
import DisLikeIcon from "components/icons/DisLikeIcon";

import { likeStatus, updateLike } from "utils/fetch";
import { getYouTubeVideoById } from "lib/videos";

import styles from "@/styles/video.module.css";

Modal.setAppElement("#__next");
export default function Video({ video }) {
  const { channelTitle, desc, publishTime, title, videoCount } = video;
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const router = useRouter();

  const videoId = router.query.videoId;

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);

    await updateLike(videoId, !isLiked ? 1 : 0);
  };
  const handleDislike = async () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);

    await updateLike(videoId, !isDisliked ? 2 : 0);
  };

  useEffect(() => {
    async function fetchData() {
      const favourited = await likeStatus(videoId);

      if (favourited === 1) return setIsLiked(true);

      if (favourited === 2) return setIsDisliked(true);
    }
    fetchData();
  }, [videoId]);

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
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=0&rel=0&modestbranding=0&origin=http://example.com`}
          frameBorder="0"></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <button onClick={handleLike}>
            <div className={styles.btnWrapper}>
              <LikeIcon selected={isLiked} />
            </div>
          </button>
          <button onClick={handleDislike}>
            <div className={styles.btnWrapper}>
              <DisLikeIcon selected={isDisliked} />
            </div>
          </button>
        </div>
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
