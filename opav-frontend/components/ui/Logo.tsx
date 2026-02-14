import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  locale?: string;
  variant?: 'full' | 'icon' | 'sidebar';
  className?: string;
}

export default function Logo({ locale = 'es', variant = 'full', className = '' }: LogoProps) {

  // Variante pequeña para sidebar (solo logo sin texto)
  if (variant === 'sidebar') {
    return (
      <Link href={`/${locale}`} className={`flex items-center ${className}`}>
        <Image
          src="/images/logos/opav-logo.png"
          alt="OPAV"
          width={80}
          height={32}
          className="h-8 w-auto"
          priority
        />
      </Link>
    );
  }

  // Variante icono (muy pequeño)
  if (variant === 'icon') {
    return (
      <Link href={`/${locale}`} className={`flex items-center ${className}`}>
        <Image
          src="/images/logos/opav-logo.png"
          alt="OPAV"
          width={60}
          height={24}
          className="h-6 w-auto"
          priority
        />
      </Link>
    );
  }

  // Variante completa (por defecto)
  return (
    <Link href={`/${locale}`} className={`flex items-center ${className}`}>
      <Image
        src="/images/logos/opav-logo.png"
        alt="OPAV"
        width={120}
        height={40}
        className="h-10 w-auto"
        priority
      />
    </Link>
  );
}