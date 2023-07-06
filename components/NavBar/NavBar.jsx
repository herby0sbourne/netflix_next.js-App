import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

import { magic } from "lib/magic.client";

import expandIcon from "../../public/static/expand_more.svg";
import netflixIcon from "../../public/static/netflix_logo.svg";

import styles from "./NavBar.module.css";
import { logOut } from "utils/fetch";

const NavBar = () => {
  const [isDropdown, setIsDropdown] = useState(false);
  const nodeRef = useRef(null);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async function () {
      try {
        const { email } = await magic.user.getMetadata();

        if (!email) return;
        setUserName(email);
      } catch (err) {
        console.log("error retrieving user", err);
      }
    })();
  }, []);

  const signOut = async () => {
    try {
      await logOut();

      router.push("/login");
    } catch (e) {
      console.log(e, "error logging out");
      router.push("/login");
    }
  };

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoWrapper}>
            <Image src={netflixIcon} alt="netflix logo icon" width="128" height="38" />
          </div>
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div style={{ position: "relative" }}>
            <button className={styles.usernameBtn}>
              <p className={styles.username} onClick={() => setIsDropdown(!isDropdown)}>
                {userName}
                {/*{userName.match(/^(.*?)@/)[1] }*/}
              </p>
              <Image src={expandIcon} alt="dropdown icon" height="25" width="25" />
            </button>
            <CSSTransition
              in={isDropdown}
              nodeRef={nodeRef}
              timeout={300}
              classNames="alert"
              unmountOnExit
              onEnter={() => setIsDropdown(true)}
              onExited={() => setIsDropdown(false)}>
              <div className={`${styles.navDropdown} alert`} ref={nodeRef}>
                <button className={styles.linkName} onClick={signOut}>
                  Sign out
                </button>
              </div>
            </CSSTransition>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
