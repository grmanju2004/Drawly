import { type JSX, type ReactNode } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title?: string;
  children?: ReactNode;
  href?: string;
}): JSX.Element {
  if (href) {
    return (
      <a
        className={className}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {title && <h2>{title}</h2>}
        {children}
      </a>
    );
  }
  
  return (
    <div className={className}>
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}
