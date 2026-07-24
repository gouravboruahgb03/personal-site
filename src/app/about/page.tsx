export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[680px] px-6 py-16">
      <h1 className="text-4xl font-bold leading-tight tracking-tight">About</h1>

      <div className="mt-8 space-y-6 text-lg leading-8">
        <p>
          This is placeholder text about you. Replace it with a short
          introduction — who you are, what you do, and what this site is for.
          Keep it friendly and to the point; a couple of sentences is plenty to
          start.
        </p>

        <p>
          This is a second placeholder paragraph. Use it to add a little more
          detail — your background, what you write about, or how people can get
          in touch. You can edit both paragraphs freely in the file
          src/app/about/page.tsx.
        </p>
      </div>
    </main>
  );
}
