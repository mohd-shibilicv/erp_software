import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                className="h-4 w-4 text-gray-500 mx-2"
                aria-hidden="true"
              />
            )}
            {index === items.length - 1 ? (
              <span
                className="text-sm font-medium text-gray-500"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
