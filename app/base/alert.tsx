import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/** Style variants for the Alert component */
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-500/30 bg-green-50 text-green-800 dark:border-green-500/30 dark:bg-green-900/30 dark:text-green-400 [&>svg]:text-green-500",
        warning:
          "border-amber-500/30 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-900/30 dark:text-amber-400 [&>svg]:text-amber-500",
        info: "border-blue-500/30 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-900/30 dark:text-blue-400 [&>svg]:text-blue-500",
        neutral:
          "border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
      },
      accentBorder: {
        none: "",
        left: "border-l-4",
        top: "border-t-4",
        right: "border-r-4",
        bottom: "border-b-4",
      },
    },
    defaultVariants: {
      variant: "default",
      accentBorder: "none",
    },
  }
);

type AlertProps = React.ComponentProps<"div"> & VariantProps<typeof alertVariants>;

/** Main alert container with customizable variants and accent borders */
function Alert({ className, variant, accentBorder, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant, accentBorder }), className)}
      {...props}
    />
  );
}

type AlertTitleProps = React.ComponentProps<"h5">;

/** Title component for the Alert with proper heading styling */
function AlertTitle({ className, ...props }: AlertTitleProps) {
  return (
    <h5 className={cn("mb-1 leading-none font-medium tracking-tight", className)} {...props} />
  );
}

type AlertDescriptionProps = React.ComponentProps<"div">;

/** Description component for the Alert with text formatting */
function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  return <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };