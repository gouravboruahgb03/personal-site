import PostEditor from "@/components/editor/PostEditor";

export const metadata = {
  title: "Write",
};

export default function WritePage() {
  return (
    <section className="mx-auto max-w-[680px] px-6 py-16 md:py-24">
      <PostEditor />
    </section>
  );
}
