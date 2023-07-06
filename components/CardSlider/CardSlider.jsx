import Link from "next/link";
import Card from "components/Card/Card";

import styles from "./CardSlider.module.css";

const CardSlider = (props) => {
  const { title, videos = [], size } = props;
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.cardWrapper}>
          {videos.map((video, idx) => {
            return (
              <Link href={`/video/${video.id}`} key={idx}>
                <Card idx={idx} imgUrl={video.imgUrl} size={size} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CardSlider;
