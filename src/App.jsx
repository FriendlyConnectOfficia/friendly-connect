import { useEffect, useRef, useState } from "react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import { auth, db, storage } from "./firebase";
import "./App.css";

const avatars = {
  Amara:
    "https://randomuser.me/api/portraits/women/44.jpg",
  David:
    "https://randomuser.me/api/portraits/men/75.jpg",
  Sarah:
    "https://randomuser.me/api/portraits/women/65.jpg",
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [postFile, setPostFile] = useState(null);
  const [postPreview, setPostPreview] = useState("");
  const [uploadingPost, setUploadingPost] =
    useState(false);
  const fileInputRef = useRef(null);

  const [commentText, setCommentText] = useState({});

  const [stories, setStories] = useState([]);
  const [storyText, setStoryText] = useState("");
  const [selectedStory, setSelectedStory] =
    useState(null);

  const [users, setUsers] = useState([]);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selectedFriend, setSelectedFriend] =
    useState(null);

  const [notifications, setNotifications] =
    useState([]);

  const [savedPosts, setSavedPosts] = useState([]);

  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState([]);

  const [marketText, setMarketText] = useState("");
  const [marketItems, setMarketItems] = useState([]);

  const [eventName, setEventName] = useState("");
  const [events, setEvents] = useState([]);

  const [reels, setReels] = useState([]);
  const [reelText, setReelText] = useState("");

  const [pages, setPages] = useState([]);
  const [pageName, setPageName] = useState("");
  const [pageDescription, setPageDescription] =
    useState("");
  const [selectedPage, setSelectedPage] =
    useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        data.sort((a, b) => {
          const aTime =
            a.createdAt?.seconds || 0;
          const bTime =
            b.createdAt?.seconds || 0;

          return bTime - aTime;
        });

        setPosts(data);
      },
      (error) => {
        console.log(
          "Posts error:",
          error.message
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "stories"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        data.sort((a, b) => {
          const aTime =
            a.createdAt?.seconds || 0;
          const bTime =
            b.createdAt?.seconds || 0;

          return bTime - aTime;
        });

        setStories(data);
      },
      (error) => {
        console.log(
          "Stories error:",
          error.message
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setUsers(data);
      },
      (error) => {
        console.log(
          "Users error:",
          error.message
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "messages"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        data.sort((a, b) => {
          const aTime =
            a.createdAt?.seconds || 0;
          const bTime =
            b.createdAt?.seconds || 0;

          return aTime - bTime;
        });

        setMessages(data);
      },
      (error) => {
        console.log(
          "Messages error:",
          error.message
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "notifications"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        data.sort((a, b) => {
          const aTime =
            a.createdAt?.seconds || 0;
          const bTime =
            b.createdAt?.seconds || 0;

          return bTime - aTime;
        });

        setNotifications(data);
      },
      (error) => {
        console.log(
          "Notifications error:",
          error.message
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "groups"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setGroups(data);
      },
      (error) => {
        console.log(
          "Groups error:",
          error.message
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "marketplace"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setMarketItems(data);
      },
      (error) => {
        console.log(
          "Marketplace error:",
          error.message
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "events"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setEvents(data);
      },
      (error) => {
        console.log(
          "Events error:",
          error.message
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "reels"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setReels(data);
      },
      (error) => {
        console.log(
          "Reels error:",
          error.message
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "pages"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        data.sort((a, b) => {
          const aTime =
            a.createdAt?.seconds || 0;
          const bTime =
            b.createdAt?.seconds || 0;

          return bTime - aTime;
        });

        setPages(data);
      },
      (error) => {
        console.log(
          "Pages error:",
          error.message
        );
      }
    );

    return () => unsubscribe();
  }, [user]);

  async function handleAuth() {
    setError("");

    try {
      if (signup) {
        if (!name.trim()) {
          setError("Please enter your name.");
          return;
        }

        const result =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        await updateProfile(result.user, {
          displayName: name.trim(),
        });

        await addDoc(collection(db, "users"), {
          uid: result.user.uid,
          name: name.trim(),
          email: email,
          createdAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function handlePostFile(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const isImage =
      file.type.startsWith("image/");

    const isVideo =
      file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert(
        "Please choose an image or video file."
      );

      event.target.value = "";
      return;
    }

    const maxSize = isVideo
      ? 100 * 1024 * 1024
      : 20 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        isVideo
          ? "Video must be 100 MB or smaller."
          : "Photo must be 20 MB or smaller."
      );

      event.target.value = "";
      return;
    }

    setPostFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPostPreview(previewUrl);
  }

  function removePostFile() {
    if (postPreview) {
      URL.revokeObjectURL(postPreview);
    }

    setPostFile(null);
    setPostPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function createPost() {
    if (!postText.trim() && !postFile) {
      alert(
        "Write something or choose a photo/video."
      );
      return;
    }

    setUploadingPost(true);

    try {
      let mediaUrl = "";
      let mediaType = "";

      if (postFile) {
        mediaType = postFile.type.startsWith(
          "video/"
        )
          ? "video"
          : "image";

        const safeName = postFile.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

        const filePath =
          "posts/" +
          user.uid +
          "/" +
          Date.now() +
          "_" +
          safeName;

        const storageRef = ref(
          storage,
          filePath
        );

        await uploadBytes(
          storageRef,
          postFile,
          {
            contentType: postFile.type,
          }
        );

        mediaUrl =
          await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "posts"), {
        uid: user.uid,
        author:
          user.displayName ||
          "Friendly User",
        text: postText.trim(),
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        fileName: postFile
          ? postFile.name
          : "",
        likes: [],
        comments: [],
        shares: 0,
        createdAt: serverTimestamp(),
      });

      setPostText("");
      removePostFile();
    } catch (err) {
      console.error(err);

      alert(
        "Could not create the post: " +
          err.message
      );
    } finally {
      setUploadingPost(false);
    }
  }

  async function likePost(post) {
    const likes = Array.isArray(post.likes)
      ? post.likes
      : [];

    const liked = likes.includes(user.uid);

    const updatedLikes = liked
      ? likes.filter(
          (id) => id !== user.uid
        )
      : [...likes, user.uid];

    await updateDoc(
      doc(db, "posts", post.id),
      {
        likes: updatedLikes,
      }
    );
  }

  async function addComment(post) {
    const text = commentText[post.id];

    if (!text || !text.trim()) return;

    const comments = Array.isArray(
      post.comments
    )
      ? post.comments
      : [];

    const newComment =
      (user.displayName ||
        "Friendly User") +
      ": " +
      text.trim();

    await updateDoc(
      doc(db, "posts", post.id),
      {
        comments: [
          ...comments,
          newComment,
        ],
      }
    );

    setCommentText({
      ...commentText,
      [post.id]: "",
    });
  }

  async function sharePost(post) {
    const shares =
      typeof post.shares === "number"
        ? post.shares
        : 0;

    await updateDoc(
      doc(db, "posts", post.id),
      {
        shares: shares + 1,
      }
    );

    alert("Post shared!");
  }

  function savePost(post) {
    const exists = savedPosts.some(
      (item) => item.id === post.id
    );

    if (!exists) {
      setSavedPosts([
        ...savedPosts,
        post,
      ]);

      alert("Post saved!");
    } else {
      setSavedPosts(
        savedPosts.filter(
          (item) =>
            item.id !== post.id
        )
      );

      alert(
        "Post removed from Saved."
      );
    }
  }

  async function createStory() {
    if (!storyText.trim()) {
      alert(
        "Please write something for your story."
      );
      return;
    }

    await addDoc(
      collection(db, "stories"),
      {
        uid: user.uid,
        author:
          user.displayName ||
          "Friendly User",
        text: storyText.trim(),
        createdAt: serverTimestamp(),
      }
    );

    setStoryText("");

    alert("Story added!");
  }

  async function createGroup() {
    if (!groupName.trim()) return;

    await addDoc(
      collection(db, "groups"),
      {
        name: groupName.trim(),
        creator:
          user.displayName ||
          "Friendly User",
        uid: user.uid,
        createdAt: serverTimestamp(),
      }
    );

    setGroupName("");
  }

  async function createMarketplaceItem() {
    if (!marketText.trim()) return;

    await addDoc(
      collection(db, "marketplace"),
      {
        text: marketText.trim(),
        seller:
          user.displayName ||
          "Friendly User",
        uid: user.uid,
        createdAt: serverTimestamp(),
      }
    );

    setMarketText("");
  }

  async function createEvent() {
    if (!eventName.trim()) return;

    await addDoc(
      collection(db, "events"),
      {
        name: eventName.trim(),
        creator:
          user.displayName ||
          "Friendly User",
        uid: user.uid,
        createdAt: serverTimestamp(),
      }
    );

    setEventName("");
  }

  async function createReel() {
    if (!reelText.trim()) return;

    await addDoc(
      collection(db, "reels"),
      {
        text: reelText.trim(),
        creator:
          user.displayName ||
          "Friendly User",
        uid: user.uid,
        createdAt: serverTimestamp(),
      }
    );

    setReelText("");
  }

  async function sendMessage() {
    if (
      !messageText.trim() ||
      !selectedFriend
    ) {
      return;
    }

    await addDoc(
      collection(db, "messages"),
      {
        sender: user.uid,
        senderName:
          user.displayName ||
          "Friendly User",
        receiver:
          selectedFriend.uid,
        receiverName:
          selectedFriend.name ||
          "Friend",
        text: messageText.trim(),
        createdAt: serverTimestamp(),
      }
    );

    setMessageText("");
  }

  async function createPage() {
    if (!pageName.trim()) {
      alert("Please enter a Page name.");
      return;
    }

    await addDoc(
      collection(db, "pages"),
      {
        name: pageName.trim(),
        description:
          pageDescription.trim(),
        creator:
          user.displayName ||
          "Friendly User",
        uid: user.uid,
        followers: [],
        createdAt: serverTimestamp(),
      }
    );

    setPageName("");
    setPageDescription("");

    alert("Your Page has been created!");
  }

  async function toggleFollowPage(pageItem) {
    const followers = Array.isArray(
      pageItem.followers
    )
      ? pageItem.followers
      : [];

    const alreadyFollowing =
      followers.includes(user.uid);

    const updatedFollowers =
      alreadyFollowing
        ? followers.filter(
            (id) => id !== user.uid
          )
        : [...followers, user.uid];

    await updateDoc(
      doc(db, "pages", pageItem.id),
      {
        followers: updatedFollowers,
      }
    );

    setSelectedPage({
      ...pageItem,
      followers: updatedFollowers,
    });
  }

  async function deletePage(pageItem) {
    if (pageItem.uid !== user.uid) return;

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this Page?"
      );

    if (!confirmDelete) return;

    await deleteDoc(
      doc(db, "pages", pageItem.id)
    );

    setSelectedPage(null);
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <h1>Friendly Connect</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="logo">
            Friendly Connect
          </div>

          <p className="tagline">
            Connect. Share. Belong.
          </p>

          {signup && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            className="auth-button"
            onClick={handleAuth}
          >
            {signup
              ? "Create Account"
              : "Log In"}
          </button>

          <button
            className="switch-button"
            onClick={() => {
              setSignup(!signup);
              setError("");
            }}
          >
            {signup
              ? "Already have an account? Log In"
              : "Create New Account"}
          </button>
        </div>
      </div>
    );
  }

  const visiblePosts = posts.filter(
    (post) => {
      if (!search.trim()) return true;

      return (
        post.text
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        post.author
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    }
  );

  return (
    <div
      className={
        darkMode ? "app dark" : "app"
      }
    >
      <header className="topbar">
        <div
          className="brand"
          onClick={() =>
            setPage("home")
          }
        >
          Friendly Connect
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search Friendly Connect"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="top-actions">
          <button
            onClick={() =>
              setPage("home")
            }
          >
            🏠
          </button>

          <button
            onClick={() =>
              setPage("friends")
            }
          >
            👥
          </button>

          <button
            onClick={() =>
              setPage("messenger")
            }
          >
            💬
          </button>

          <button
            onClick={() =>
              setPage(
                "notifications"
              )
            }
          >
            🔔
          </button>

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() =>
              signOut(auth)
            }
          >
            Logout
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="profile-mini">
            <div className="profile-avatar">
              {(
                user.displayName ||
                "U"
              )[0].toUpperCase()}
            </div>

            <strong>
              {user.displayName ||
                "Friendly User"}
            </strong>
          </div>

          <button
            onClick={() =>
              setPage("home")
            }
          >
            🏠 Home
          </button>

          <button
            onClick={() =>
              setPage("friends")
            }
          >
            👥 Friends
          </button>

          <button
            onClick={() =>
              setPage("messenger")
            }
          >
            💬 Messenger
          </button>

          <button
            onClick={() =>
              setPage(
                "notifications"
              )
            }
          >
            🔔 Notifications
          </button>

          <button
            onClick={() =>
              setPage("groups")
            }
          >
            👨‍👩‍👧 Groups
          </button>

          <button
            onClick={() =>
              setPage("marketplace")
            }
          >
            🛒 Marketplace
          </button>

          <button
            onClick={() =>
              setPage("events")
            }
          >
            📅 Events
          </button>

          <button
            onClick={() =>
              setPage("reels")
            }
          >
            🎬 Reels
          </button>

          <button
            onClick={() =>
              setPage("saved")
            }
          >
            🔖 Saved
          </button>

          <button
            onClick={() =>
              setPage("pages")
            }
          >
            📄 Pages
          </button>

          <button
            onClick={() =>
              setPage("profile")
            }
          >
            👤 Profile
          </button>
        </aside>

        <main className="main">
          {page === "home" && (
            <>
              <section className="stories">
                <div
                  className="story create-story"
                  onClick={() => {
                    document
                      .getElementById(
                        "story-creator"
                      )
                      ?.scrollIntoView({
                        behavior:
                          "smooth",
                      });
                  }}
                >
                  <div className="story-picture">
                    +
                  </div>

                  <strong>
                    Create story
                  </strong>
                </div>

                {stories.map(
                  (story) => (
                    <div
                      className="story"
                      key={story.id}
                      onClick={() =>
                        setSelectedStory(
                          story
                        )
                      }
                    >
                      <div className="story-text">
                        {story.text}
                      </div>

                      <strong>
                        {story.author}
                      </strong>
                    </div>
                  )
                )}

                {Object.entries(
                  avatars
                ).map(
                  ([
                    person,
                    image,
                  ]) => (
                    <div
                      className="story"
                      key={person}
                    >
                      <img
                        src={image}
                        alt={person}
                      />

                      <strong>
                        {person}
                      </strong>
                    </div>
                  )
                )}
              </section>

              <section
                className="create-post-card"
                id="story-creator"
              >
                <h3>
                  📖 Create a Story
                </h3>

                <textarea
                  placeholder="Write something for your story..."
                  value={storyText}
                  onChange={(e) =>
                    setStoryText(
                      e.target.value
                    )
                  }
                />

                <button
                  className="post-button"
                  onClick={createStory}
                >
                  Add Story
                </button>
              </section>

              <section className="create-post-card">
                <h3>
                  Create Post
                </h3>

                <textarea
                  placeholder={`What's on your mind, ${
                    user.displayName ||
                    "Friend"
                  }?`}
                  value={postText}
                  onChange={(e) =>
                    setPostText(
                      e.target.value
                    )
                  }
                />

                {postPreview && (
                  <div className="upload-preview">
                    {postFile?.type.startsWith(
                      "video/"
                    ) ? (
                      <video
                        src={postPreview}
                        controls
                      />
                    ) : (
                      <img
                        src={postPreview}
                        alt="Post preview"
                      />
                    )}

                    <button
                      className="remove-media"
                      onClick={
                        removePostFile
                      }
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}

                <div className="post-tools">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={
                      handlePostFile
                    }
                    hidden
                  />

                  <button
                    className="media-button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    📷 Photo / 🎥 Video
                  </button>

                  <button
                    className="post-button"
                    onClick={createPost}
                    disabled={uploadingPost}
                  >
                    {uploadingPost
                      ? "Uploading..."
                      : "Post"}
                  </button>
                </div>

                <small className="upload-help">
                  Photos up to 20 MB.
                  Videos up to 100 MB.
                </small>
              </section>

              {visiblePosts.map(
                (post) => (
                  <article
                    className="post-card"
                    key={post.id}
                  >
                    <div className="post-header">
                      <div className="post-avatar">
                        {(
                          post.author ||
                          "U"
                        )[0].toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {post.author}
                        </strong>

                        <small>
                          Friendly Connect
                        </small>
                      </div>
                    </div>

                    {post.text && (
                      <p className="post-content">
                        {post.text}
                      </p>
                    )}

                    {post.mediaUrl &&
                      post.mediaType ===
                        "image" && (
                        <div className="post-media">
                          <img
                            src={
                              post.mediaUrl
                            }
                            alt="Post"
                          />
                        </div>
                      )}

                    {post.mediaUrl &&
                      post.mediaType ===
                        "video" && (
                        <div className="post-media">
                          <video
                            src={
                              post.mediaUrl
                            }
                            controls
                            playsInline
                          />
                        </div>
                      )}

                    <div className="post-stats">
                      <span>
                        👍{" "}
                        {Array.isArray(
                          post.likes
                        )
                          ? post.likes
                              .length
                          : 0}
                      </span>

                      <span>
                        💬{" "}
                        {Array.isArray(
                          post.comments
                        )
                          ? post.comments
                              .length
                          : 0}
                      </span>

                      <span>
                        ↗️{" "}
                        {post.shares ||
                          0}
                      </span>
                    </div>

                    <div className="post-actions">
                      <button
                        onClick={() =>
                          likePost(
                            post
                          )
                        }
                      >
                        👍 Like
                      </button>

                      <button
                        onClick={() =>
                          document
                            .getElementById(
                              "comment-" +
                                post.id
                            )
                            ?.focus()
                        }
                      >
                        💬 Comment
                      </button>

                      <button
                        onClick={() =>
                          sharePost(
                            post
                          )
                        }
                      >
                        ↗️ Share
                      </button>

                      <button
                        onClick={() =>
                          savePost(
                            post
                          )
                        }
                      >
                        🔖 Save
                      </button>
                    </div>

                    <div className="comment-box">
                      <input
                        id={
                          "comment-" +
                          post.id
                        }
                        placeholder="Write a comment..."
                        value={
                          commentText[
                            post.id
                          ] || ""
                        }
                        onChange={(e) =>
                          setCommentText(
                            {
                              ...commentText,
                              [post.id]:
                                e.target
                                  .value,
                            }
                          )
                        }
                      />

                      <button
                        onClick={() =>
                          addComment(
                            post
                          )
                        }
                      >
                        Send
                      </button>
                    </div>

                    {Array.isArray(
                      post.comments
                    ) &&
                      post.comments.length >
                        0 && (
                        <div className="comments">
                          {post.comments.map(
                            (
                              comment,
                              index
                            ) => (
                              <div
                                className="comment"
                                key={
                                  index
                                }
                              >
                                {
                                  comment
                                }
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </article>
                )
              )}
            </>
          )}

          {page === "friends" && (
            <section className="page-card">
              <h2>
                👥 Friends
              </h2>

              {users.length === 0 ? (
                <p>
                  No other users yet.
                </p>
              ) : (
                users
                  .filter(
                    (item) =>
                      item.uid !==
                      user.uid
                  )
                  .map(
                    (friend) => (
                      <div
                        className="friend-row"
                        key={
                          friend.id
                        }
                      >
                        <div className="profile-avatar">
                          {(
                            friend.name ||
                            "U"
                          )[0].toUpperCase()}
                        </div>

                        <strong>
                          {
                            friend.name
                          }
                        </strong>

                        <button
                          onClick={() => {
                            setSelectedFriend(
                              friend
                            );

                            setPage(
                              "messenger"
                            );
                          }}
                        >
                          Message
                        </button>
                      </div>
                    )
                  )
              )}
            </section>
          )}

          {page === "messenger" && (
            <section className="page-card">
              <h2>
                💬 Messenger
              </h2>

              <div className="friend-list">
                {users
                  .filter(
                    (item) =>
                      item.uid !==
                      user.uid
                  )
                  .map(
                    (friend) => (
                      <button
                        key={
                          friend.id
                        }
                        onClick={() =>
                          setSelectedFriend(
                            friend
                          )
                        }
                      >
                        {
                          friend.name
                        }
                      </button>
                    )
                  )}
              </div>

              {selectedFriend && (
                <div className="chat">
                  <h3>
                    Chat with{" "}
                    {
                      selectedFriend.name
                    }
                  </h3>

                  <div className="messages">
                    {messages
                      .filter(
                        (message) =>
                          (message.sender ===
                            user.uid &&
                            message.receiver ===
                              selectedFriend.uid) ||
                          (message.sender ===
                            selectedFriend.uid &&
                            message.receiver ===
                              user.uid)
                      )
                      .map(
                        (message) => (
                          <div
                            className={
                              message.sender ===
                              user.uid
                                ? "message mine"
                                : "message"
                            }
                            key={
                              message.id
                            }
                          >
                            {
                              message.text
                            }
                          </div>
                        )
                      )}
                  </div>

                  <div className="message-input">
                    <input
                      placeholder="Write a message..."
                      value={
                        messageText
                      }
                      onChange={(e) =>
                        setMessageText(
                          e.target
                            .value
                        )
                      }
                    />

                    <button
                      onClick={
                        sendMessage
                      }
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {page ===
            "notifications" && (
            <section className="page-card">
              <h2>
                🔔 Notifications
              </h2>

              {notifications.length ===
              0 ? (
                <p>
                  No notifications yet.
                </p>
              ) : (
                notifications.map(
                  (item) => (
                    <div
                      className="notification"
                      key={
                        item.id
                      }
                    >
                      {item.text ||
                        "You have a new notification."}
                    </div>
                  )
                )
              )}
            </section>
          )}

          {page === "groups" && (
            <section className="page-card">
              <h2>
                👨‍👩‍👧 Groups
              </h2>

              <div className="form-row">
                <input
                  placeholder="Group name"
                  value={
                    groupName
                  }
                  onChange={(e) =>
                    setGroupName(
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={
                    createGroup
                  }
                >
                  Create Group
                </button>
              </div>

              {groups.map(
                (group) => (
                  <div
                    className="item-card"
                    key={
                      group.id
                    }
                  >
                    <strong>
                      {
                        group.name
                      }
                    </strong>

                    <p>
                      Created by{" "}
                      {
                        group.creator
                      }
                    </p>
                  </div>
                )
              )}
            </section>
          )}

          {page ===
            "marketplace" && (
            <section className="page-card">
              <h2>
                🛒 Marketplace
              </h2>

              <div className="form-row">
                <input
                  placeholder="What are you selling?"
                  value={
                    marketText
                  }
                  onChange={(e) =>
                    setMarketText(
                      e.target
                        .value
                    )
                  }
                />

                <button
                  onClick={
                    createMarketplaceItem
                  }
                >
                  Sell
                </button>
              </div>

              {marketItems.map(
                (item) => (
                  <div
                    className="item-card"
                    key={
                      item.id
                    }
                  >
                    <h3>
                      {
                        item.text
                      }
                    </h3>

                    <p>
                      Seller:{" "}
                      {
                        item.seller
                      }
                    </p>
                  </div>
                )
              )}
            </section>
          )}

          {page === "events" && (
            <section className="page-card">
              <h2>
                📅 Events
              </h2>

              <div className="form-row">
                <input
                  placeholder="Event name"
                  value={
                    eventName
                  }
                  onChange={(e) =>
                    setEventName(
                      e.target
                        .value
                    )
                  }
                />

                <button
                  onClick={
                    createEvent
                  }
                >
                  Create Event
                </button>
              </div>

              {events.map(
                (event) => (
                  <div
                    className="item-card"
                    key={
                      event.id
                    }
                  >
                    <h3>
                      {
                        event.name
                      }
                    </h3>

                    <p>
                      Created by{" "}
                      {
                        event.creator
                      }
                    </p>
                  </div>
                )
              )}
            </section>
          )}

          {page === "reels" && (
            <section className="page-card">
              <h2>
                🎬 Reels
              </h2>

              <div className="form-row">
                <input
                  placeholder="Write something for your Reel"
                  value={
                    reelText
                  }
                  onChange={(e) =>
                    setReelText(
                      e.target
                        .value
                    )
                  }
                />

                <button
                  onClick={
                    createReel
                  }
                >
                  Add Reel
                </button>
              </div>

              {reels.map(
                (reel) => (
                  <div
                    className="reel-card"
                    key={
                      reel.id
                    }
                  >
                    <div className="reel-icon">
                      ▶
                    </div>

                    <p>
                      {
                        reel.text
                      }
                    </p>

                    <small>
                      {
                        reel.creator
                      }
                    </small>
                  </div>
                )
              )}
            </section>
          )}

          {page === "saved" && (
            <section className="page-card">
              <h2>
                🔖 Saved Posts
              </h2>

              {savedPosts.length ===
              0 ? (
                <p>
                  You have no saved posts.
                </p>
              ) : (
                savedPosts.map(
                  (post) => (
                    <article
                      className="post-card"
                      key={
                        post.id
                      }
                    >
                      <strong>
                        {
                          post.author
                        }
                      </strong>

                      <p>
                        {
                          post.text
                        }
                      </p>

                      {post.mediaUrl &&
                        post.mediaType ===
                          "image" && (
                          <img
                            className="saved-media"
                            src={
                              post.mediaUrl
                            }
                            alt="Saved post"
                          />
                        )}

                      {post.mediaUrl &&
                        post.mediaType ===
                          "video" && (
                          <video
                            className="saved-media"
                            src={
                              post.mediaUrl
                            }
                            controls
                          />
                        )}
                    </article>
                  )
                )
              )}
            </section>
          )}

          {page === "profile" && (
            <section className="profile-page">
              <div className="cover">
                <div className="large-avatar">
                  {(
                    user.displayName ||
                    "U"
                  )[0].toUpperCase()}
                </div>
              </div>

              <div className="profile-info">
                <h1>
                  {user.displayName ||
                    "Friendly User"}
                </h1>

                <p>
                  {user.email}
                </p>

                <p>
                  Welcome to Friendly
                  Connect!
                </p>
              </div>
            </section>
          )}

          {page === "pages" && (
            <section className="page-card">
              <h2>
                📄 Pages
              </h2>

              <div className="create-page-box">
                <h3>
                  Create a Page
                </h3>

                <input
                  type="text"
                  placeholder="Page name"
                  value={
                    pageName
                  }
                  onChange={(e) =>
                    setPageName(
                      e.target
                        .value
                    )
                  }
                />

                <textarea
                  placeholder="Page description"
                  value={
                    pageDescription
                  }
                  onChange={(e) =>
                    setPageDescription(
                      e.target
                        .value
                    )
                  }
                />

                <button
                  className="post-button"
                  onClick={
                    createPage
                  }
                >
                  Create Page
                </button>
              </div>

              <h3>
                Discover Pages
              </h3>

              {pages.length === 0 ? (
                <p>
                  No Pages yet.
                  Create the first
                  one!
                </p>
              ) : (
                <div className="pages-grid">
                  {pages.map(
                    (
                      pageItem
                    ) => (
                      <div
                        className="page-tile"
                        key={
                          pageItem.id
                        }
                        onClick={() =>
                          setSelectedPage(
                            pageItem
                          )
                        }
                      >
                        <div className="page-icon">
                          📄
                        </div>

                        <h3>
                          {
                            pageItem.name
                          }
                        </h3>

                        <p>
                          {pageItem.description ||
                            "No description"}
                        </p>

                        <small>
                          {Array.isArray(
                            pageItem.followers
                          )
                            ? pageItem
                                .followers
                                .length
                            : 0}{" "}
                          followers
                        </small>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>
          )}
        </main>

        <aside className="right-sidebar">
          <h3>
            Suggested Friends
          </h3>

          {Object.entries(
            avatars
          ).map(
            ([
              person,
              image,
            ]) => (
              <div
                className="suggestion"
                key={person}
              >
                <img
                  src={image}
                  alt={person}
                />

                <div>
                  <strong>
                    {person}
                  </strong>

                  <small>
                    Suggested for you
                  </small>
                </div>
              </div>
            )
          )}
        </aside>
      </div>

      {selectedStory && (
        <div
          className="story-viewer"
          onClick={() =>
            setSelectedStory(null)
          }
        >
          <div
            className="story-view"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="story-close"
              onClick={() =>
                setSelectedStory(
                  null
                )
              }
            >
              ✕
            </button>

            <div className="story-view-content">
              <h2>
                {
                  selectedStory.author
                }
              </h2>

              <p>
                {
                  selectedStory.text
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedPage && (
        <div
          className="page-viewer"
          onClick={() =>
            setSelectedPage(null)
          }
        >
          <div
            className="page-view"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="page-close"
              onClick={() =>
                setSelectedPage(
                  null
                )
              }
            >
              ✕
            </button>

            <div className="page-cover">
              📄
            </div>

            <h1>
              {
                selectedPage.name
              }
            </h1>

            <p>
              {selectedPage.description ||
                "Welcome to this Page."}
            </p>

            <p>
              <strong>
                {Array.isArray(
                  selectedPage.followers
                )
                  ? selectedPage
                      .followers
                      .length
                  : 0}
              </strong>{" "}
              followers
            </p>

            <button
              className="post-button"
              onClick={() =>
                toggleFollowPage(
                  selectedPage
                )
              }
            >
              {Array.isArray(
                selectedPage.followers
              ) &&
              selectedPage.followers.includes(
                user.uid
              )
                ? "Unfollow"
                : "Follow"}
            </button>

            {selectedPage.uid ===
              user.uid && (
              <button
                className="delete-button"
                onClick={() =>
                  deletePage(
                    selectedPage
                  )
                }
              >
                Delete Page
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;