import { createClient } from "@/lib/supabase/client";

const BUCKET = "post-images";

// Uploads a file to the post-images storage bucket and returns its public URL.
export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
