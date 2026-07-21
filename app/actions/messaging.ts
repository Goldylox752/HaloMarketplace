```ts
"use server";

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