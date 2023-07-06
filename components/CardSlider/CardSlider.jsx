import Link from "next/link";
import Card from "components/Card/Card";
import cls from "classnames";
import styles from "./CardSlider.module.css";

const CardSlider = (props) => {
  const { title, videos = [], size, isWrap = false, isHover } = props;
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={cls(styles.cardWrapper, isWrap && styles.wrap)}>
          {videos.map((video, idx) => {
            return (
              <Link href={`/video/${video.id}`} key={idx}>
                <Card idx={idx} imgUrl={video.imgUrl} size={size} isHover={isHover} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CardSlider;
