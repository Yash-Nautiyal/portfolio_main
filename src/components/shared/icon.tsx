import Image from "next/image";

export function Icon({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} width={20} height={20} className="h-5 w-5 object-contain" />;
}
