import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("rounded-lg border bg-white p-6 shadow-sm", className)}
            {...props}
        />
    )
);

Card.displayName = "Card";

const CardContent = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-4 text-sm text-gray-700">{children}</div>
);

export { Card, CardContent };