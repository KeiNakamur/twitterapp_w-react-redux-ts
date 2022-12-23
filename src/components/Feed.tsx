import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import styles from "./Feed.module.css";
import TweetInput from "./TweetInput";
import Post from "./Post";

const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: "",
      avatar: "",
      image: "",
      text: "",
      timestamp: null,
      username: "",
    },
  ]);

  useEffect(() => {
    // firebaseのDBにアクセスしてデータを取得
    const unSub = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      // firestoreにあるコレクションの追加・削除・変更をクライアントサイドにリアルタイムに反映する場合にonSnapshot
      .onSnapshot((snapshot) =>
        setPosts(
          // snapshot.docsでpostsの中にあるdocumentの全て取得
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        )
      );
    // cleanUp関数
    return () => {
      unSub();
    };
  }, []);

  return (
    <div className={styles.feed}>
      <TweetInput />
      {posts[0]?.id && (
        <>
          {posts.map((post, index) => (
            // Postで定義したpropsの型でpropsを送る
            <Post
              key={index}
              postId={post.id}
              avatar={post.avatar}
              image={post.image}
              text={post.text}
              timestamp={post.timestamp}
              username={post.username}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Feed;
