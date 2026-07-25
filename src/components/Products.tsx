import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  image: string | null;
  stripe_payment_link: string | null;
};

function ProductCard({ product }: { product: Product }) {
  const href = product.stripe_payment_link ?? "#";
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group block">
      <div className="aspect-[16/9] overflow-hidden bg-surface">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-200 group-hover:brightness-[0.85]"
          />
        ) : (
          <div className="h-full w-full bg-surface" />
        )}
      </div>

      <h3 className="card-title mt-6">{product.name}</h3>
      {product.description && (
        <p className="mt-2 line-clamp-2 text-muted">{product.description}</p>
      )}
      <span className="mt-4 inline-block font-bold italic text-white underline underline-offset-4">
        Get it &rarr;
      </span>
    </a>
  );
}

export default async function Products() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, description, price, image, stripe_payment_link")
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-content px-6 py-24 md:px-10 md:py-40">
      <Reveal>
        <Eyebrow>Resources</Eyebrow>
        <h2 className="h-section mt-6 max-w-2xl">Tools to buy back your time.</h2>
      </Reveal>

      {!products || products.length === 0 ? (
        <Reveal>
          <p className="subhead mt-10 text-faint">Resources coming soon.</p>
        </Reveal>
      ) : (
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {products.map((product: Product, i) => (
            <Reveal as="div" key={product.id} delay={i % 2 === 0 ? 0 : 80}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
