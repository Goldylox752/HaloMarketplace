import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Get or create a conversation between two users (returns conversation ID)
export async function getOrCreateConversation(otherUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Order IDs to ensure consistency
  const [a, b] = [user.id, otherUserId].sort();
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user1_id", a)
    .eq("user2_id", b)
    .maybeSingle();

  if (existing) return existing.id;

  // Create new conversation
  const { data: newConv, error } = await supabase
    .from("conversations")
    .insert({ user1_id: a, user2_id: b })
    .select("id")
    .single();

  if (error) throw new Error("Could not create conversation");
  return newConv.id;
}

// Send a message
export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const content = formData.get("content")?.toString().trim();
  const conversationId = formData.get("conversationId")?.toString();
  const receiverId = formData.get("receiverId")?.toString();

  if (!content || !conversationId || !receiverId) {
    throw new Error("Missing required fields");
  }

  // Insert message
  const { error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      receiver_id: receiverId,
      content,
    });

  if (error) throw new Error("Failed to send message");

  // Update conversation's last_message
  await supabase
    .from("conversations")
    .update({
      last_message: content,
      last_message_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  revalidatePath("/messages");
  revalidatePath(`/messages/${receiverId}`);
}
```

---

📁 3. Conversations List (app/messages/page.tsx)

Server component – lists all conversations for the logged‑in user.

```tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

async function getConversations(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id,
      user1_id,
      user2_id,
      last_message,
      last_message_at,
      user1:profiles!conversations_user1_id_fkey (username, avatar),
      user2:profiles!conversations_user2_id_fkey (username, avatar)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order("last_message_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((conv) => {
    const otherUserId = conv.user1_id === userId ? conv.user2_id : conv.user1_id;
    const otherProfile = conv.user1_id === userId ? conv.user2 : conv.user1;
    return {
      id: conv.id,
      otherUserId,
      otherUsername: otherProfile?.username || "Unknown",
      otherAvatar: otherProfile?.avatar || "/avatar.png",
      lastMessage: conv.last_message || "Start a conversation",
      lastMessageAt: conv.last_message_at,
    };
  });
}

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const conversations = await getConversations(user.id);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Messages</h1>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-gray-500">
            No conversations yet.
            <Link href="/" className="block mt-2 text-indigo-600 font-bold">
              Browse listings to start chatting
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/messages/${conv.otherUserId}`}
                className="block bg-white rounded-3xl shadow p-4 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={conv.otherAvatar}
                    alt={conv.otherUsername}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h2 className="font-bold">{conv.otherUsername}</h2>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(conv.lastMessageAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
```

---

📁 4. Chat Page with Real‑Time (app/messages/[userId]/page.tsx)

This is a client component that subscribes to new messages in real time.

```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import { sendMessage, getOrCreateConversation } from "@/app/actions/messaging";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export default function ChatPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const otherUserId = params.userId;

  // Initial setup
  useEffect(() => {
    async function init() {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUser(user);

      // Get or create conversation via server action
      try {
        const convId = await getOrCreateConversation(otherUserId);
        setConversationId(convId);
      } catch (err) {
        console.error(err);
        return;
      }

      // Fetch other user's profile
      const { data: otherProfile } = await supabase
        .from("profiles")
        .select("username, avatar")
        .eq("id", otherUserId)
        .single();
      setOtherUser(
        otherProfile || { username: "User", avatar: "/avatar.png" }
      );

      // Fetch messages
      const { data: msgs, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      setMessages(msgs || []);
      setLoading(false);
    }
    init();
  }, [supabase, router, otherUserId]);

  // Real-time subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending via server action
  async function handleSend(formData: FormData) {
    formData.set("conversationId", conversationId!);
    formData.set("receiverId", otherUserId);
    await sendMessage(formData);
    setNewMessage("");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading messages...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-3">
          <Link href="/messages" className="text-indigo-600 font-bold">
            ← Back
          </Link>
          <Image
            src={otherUser?.avatar || "/avatar.png"}
            alt={otherUser?.username || "User"}
            width={40}
            height={40}
            className="rounded-full"
          />
          <h2 className="font-bold">{otherUser?.username || "User"}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isMine = msg.sender_id === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMine
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                  <div
                    className={`text-xs mt-1 ${
                      isMine ? "text-indigo-200" : "text-gray-500"
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form action={handleSend} className="p-4 border-t flex gap-3">
          <input
            name="content"
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-xl border p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );