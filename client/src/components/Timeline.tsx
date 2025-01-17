import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Post from "./Post";
import { PostType } from "../types";

const Timeline = () => {
  const [postText, setPostText] = useState<string>("");
  const [latestPosts, setLatestPosts] = useState<PostType[]>([]);

  // 投稿ボタンを押した時の処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newPosts = await axiosInstance.post("/posts/post", {
        content: postText,
      });

      setLatestPosts((prevPosts) => [newPosts.data, ...prevPosts]);
      setPostText("");
    } catch (error) {
      console.error(error);
      alert("ログインしてください。");
    }
  };

  // コンポーネントをレンダリングした時に実行される処理
  // 投稿を日付順に取得するAPIを実行
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await axiosInstance.get("/posts/get_latest_post");
        setLatestPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-4">
        <div className="bg-white shadow-md rounded p-4 mb-4">
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setPostText(e.target.value)
              }
            ></textarea>
            <button
              type="submit"
              className="mt-2 bg-gray-700 hover:bg-green-700 duration-200 text-white font-semibold py-2 px-4 rounded"
            >
              投稿
            </button>
          </form>
        </div>
        {latestPosts.map((post: PostType) => (
          <Post key={post.id} post={post} />
        ))}
      </main>
    </div>
  );
};

export default Timeline;
