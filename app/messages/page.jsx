import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Chat from "@/components/Chat";
import { getOrCreateConversation } from "@/app/actions/messaging";

// ─── Helpers ──────────────────────────────────────────────────────

async function getConversations(userId) {
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
    console.error("Conversations error:", error);
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

async function getMessagesForConversation(userId, otherUserId) {
  const supabase = await createClient();

  // Try to get the conversation ID
  const [a, b] = [userId, otherUserId].sort();
  const { data: conv } = await supabase
    .from("conversations")
    .select("id")
    .eq("user1_id", a)
    .eq("user2_id", b)
    .maybeSingle();

  if (!conv) {
    return { messages: [], conversationId: null };
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conv.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Messages error:", error);
    return { messages: [], conversationId: conv.id };
  }

  return { messages: data || [], conversationId: conv.id };
}

// ─── Page Component ──────────────────────────────────────────────

export const metadata = {
  title: "Messages | Halo Marketplace",
  description: "Chat with buyers and sellers.",
};

export default async function MessagesPage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sellerId = searchParams?.seller || "";
  const conversations = await getConversations(user.id);

  let initialMessages = [];
  let conversationId = null;
  let sellerProfile = null;

  if (sellerId) {
    // Fetch messages for this seller
    const result = await getMessagesForConversation(user.id, sellerId);
    initialMessages = result.messages;
    conversationId = result.conversationId;

    // If no conversation exists, create one now (so the chat can start fresh)
    if (!conversationId) {
      conversationId = await getOrCreateConversation(sellerId);
    }

    // Get seller's profile for the header
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar")
      .eq("id", sellerId)
      .single();
    sellerProfile = profile || { username: "User", avatar: "/avatar.png" };
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow overflow-hidden">
        <div className="flex flex-col md:flex-row h-[80vh]">
          {/* Conversation List – Left Side */}
          <aside className="w-full md:w-80 border-r bg-gray-50 flex-shrink-0 overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Conversations</h2>
            </div>
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No conversations yet.
                <Link href="/" className="block text-indigo-600 font-bold mt-2">
                  Browse listings
                </Link>
              </div>
            ) : (
              <ul className="divide-y">
                {conversations.map((conv) => (
                  <li key={conv.id}>
                    <Link
                      href={`/messages?seller=${conv.otherUserId}`}
                      className={`block px-4 py-3 hover:bg-gray-100 transition ${
                        sellerId === conv.otherUserId ? "bg-indigo-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={conv.otherAvatar}
                          alt={conv.otherUsername}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {conv.otherUsername}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {conv.lastMessage}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(conv.lastMessageAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Chat Area – Right Side */}
          <div className="flex-1 flex flex-col">
            {sellerId ? (
              <Chat
                user={user}
                receiverId={sellerId}
                initialMessages={initialMessages}
                conversationId={conversationId}
                sellerProfile={sellerProfile}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p>Select a conversation or start chatting from a product page</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}