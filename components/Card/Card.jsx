import { useState } from "react";
import Image from "next/image";

import styles from "./Card.module.css";
import { motion } from "framer-motion";
import cls from "classnames";

const Card = (props) => {
  const {
    imgUrl = process.env.NEXT_PUBLIC_IMAGE_DEFAULT,
    size = "medium",
    idx,
    isHover = true
  } = props;
  const [imgSrc, setImgSrc] = useState(imgUrl);

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem
  };

  const handleOnError = () => {
    setImgSrc(process.env.NEXT_PUBLIC_IMAGE_DEFAULT);
  };

  const scale = idx === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  const shouldHover = isHover && { whileHover: { ...scale } };
  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imgMotionWrapper, classMap[size])}
        {...shouldHover}
        transition={{ duration: 0.3, ease: "easeInOut" }}>
        <Image
          className={styles.cardImg}
          src={imgSrc}
          alt="name of image"
          fill
          onError={handleOnError}
        />
      </motion.div>
    </div>
  );
};

export default Card;
