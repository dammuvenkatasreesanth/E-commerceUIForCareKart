import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImg from '../../imports/_Linked_File_-1.png';

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <ImageWithFallback
      src={logoImg}
      alt="CareKart Gloves"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}