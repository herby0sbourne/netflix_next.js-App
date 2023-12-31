import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { magic } from "lib/magic.client";
import useRouterEvent from "hooks/useRouterEvent";

import netflixIcon from "../../public/static/netflix_logo.svg";
import styles from "@/styles/Login.module.css";

export default function Login() {
  const [userMsg, setUserMsg] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleComplete = useRouterEvent(setIsLoading, router);

  const handleOnChange = (e) => {
    setUserMsg("");
    setEmail(e.target.value);
  };

  const handleLogin = async () => {
    handleComplete();

    if (!email) {
      setUserMsg("Enter a Valid Email Address");
      return;
    }

    if (email) {
      try {
        setIsLoading(true);
        const DIDToken = await magic.auth.loginWithMagicLink({ email });

        if (DIDToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${DIDToken}`,
              "Content-Type": "application/json"
            }
          });

          const loggedInResponse = await response.json();
          if (loggedInResponse.done) {
            router.push("/");
          } else {
            setUserMsg("Something went wrong logging in");
            setIsLoading(false);
          }
        }
      } catch (e) {
        console.log(e, "something went wrong");
      }
    } else {
      setUserMsg("Something went wrong logging in");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image src={netflixIcon} alt="netflix logo icon" width="128" height="38" />
            </div>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="email"
            onChange={handleOnChange}
            className={styles.emailInput}
            placeholder="Email Address"
            name="email"
            required
          />
          <p className={styles.userMsg}>{userMsg || ""}</p>
          <button
            onClick={handleLogin}
            className={styles.loginBtn}
            type="button"
            disabled={isLoading}>
            {isLoading ? "Loader..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
}
