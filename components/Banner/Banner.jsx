import Image from "next/image";
import { useRouter } from "next/router";
import playIcon from "../../public/static/play_arrow.svg";

import styles from "./Banner.module.css";

const Banner = ({ title, subTitle, imgUrl, videoId }) => {
  const router = useRouter();
  const handleOnPlay = () => {
    router.push(`/video/${videoId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          <div className={styles.nseriesWrapper}>
            <p className={styles.firstLetter}>N</p>
            <p className={styles.series}>S E R I E S</p>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <h3 className={styles.subTitle}>{subTitle}</h3>
          <div className={styles.playBtnWrapper}>
            <button className={styles.btnWithIcon} onClick={handleOnPlay}>
              <Image src={playIcon} alt="play button icon" width="32" height="32" />
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.bannerImg}
        style={{
          background: `url(${imgUrl}) no-repeat center/cover`,
          width: "100%",
          height: "100%",
          position: "absolute"
        }}></div>
    </div>
  );
};

export default Banner;
