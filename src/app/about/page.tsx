import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "About",
  description:
    "Gourav Boruah — building AI-powered systems for content, leads, and automation so you can work less and enjoy more.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-prose px-6 py-24 md:py-32">
      <Reveal>
        <Eyebrow>About</Eyebrow>
        <h1 className="h-section mt-6">The person behind the ideas.</h1>
      </Reveal>

      <div className="prose-post mt-12">
        <p>
          My name is Gourav Boruah. I write about A.I, automation, human nature,
          the mind, and value creation.
        </p>
        <p>
          These are the ideas I&apos;m most curious about — and this is where I
          think them through in the open. If any of it resonates, you&apos;re
          welcome to follow along.
        </p>
      </div>
    </section>
  );
}
