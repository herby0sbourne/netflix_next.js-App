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
            return <Card key={idx} idx={idx} imgUrl={video.imgUrl} size={size} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default CardSlider;
