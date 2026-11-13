import Link from "next/link";
import Image from "next/image";

interface DestinationCardProps {
  slug: string;
  name: string;
  image: string | null;
  shortDesc: string | null;
  category: string;
}

export default function DestinationCard({
  slug,
  name,
  image,
  shortDesc,
  category,
}: DestinationCardProps) {
  return (
    <Link href={`/destinations/${slug}`} className="card group block">
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
            📍
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-xs font-medium text-primary-300 uppercase tracking-wider">
            {category}
          </span>
          <h3 className="font-display text-xl font-bold text-white mt-1">
            {name}
          </h3>
          {shortDesc && (
            <p className="text-sm text-gray-200 mt-1 line-clamp-1">{shortDesc}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
