"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon, type LucideIcon } from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";
import { createContext, useContext } from "react";

type AccordionVariant = "default" | "secondary" | "bordered" | "card";

/** Accordion style variants */
const accordionVariants = {
  accordionItem: cva("", {
    variants: {
      variant: {
        default: "border-b",
        secondary: "border border-muted hover:border-primary bg-muted rounded-lg mb-2 last:mb-0",
        bordered: "border border-border rounded-md mb-2 last:mb-0 overflow-hidden",
        card: "rounded-lg mb-3 last:mb-0 shadow-sm hover:shadow transition-shadow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }),
  accordionTrigger: cva(
    "flex flex-1 items-center justify-between cursor-pointer disabled:cursor-default py-4 font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-300 [&>svg]:ease-emphasized [&[data-state=open]>svg]:rotate-180",
    {
      variants: {
        variant: {
          default: "hover:underline",
          secondary: "px-5",
          bordered: "px-4 bg-muted/50 hover:bg-muted",
          card: "px-4 bg-card [data-state=open]:rounded-b-none",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  ),
  accordionContent: cva("pb-4 pt-0", {
    variants: {
      variant: {
        default: "",
        secondary: "px-5",
        bordered: "px-4 pt-4",
        card: "px-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }),
};

/** Context props for Accordion configuration */
type AccordionContextProps = {
  variant?: AccordionVariant;
  triggerIcon?: LucideIcon | boolean;
};

const AccordionContext = createContext<AccordionContextProps | undefined>(undefined);

/** Hook to access Accordion context */
function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordionContext must be used within an AccordionProvider");
  }
  return context;
}

type AccordionProviderProps = {
  children: React.ReactNode;
} & AccordionContextProps;

/** Provider component for Accordion context */
function AccordionProvider({ children, triggerIcon, ...rest }: AccordionProviderProps) {
  return (
    <AccordionContext.Provider value={{ triggerIcon, ...rest }}>
      {children}
    </AccordionContext.Provider>
  );
}

/** Individual accordion item component */
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const { variant } = useAccordionContext();
  return (
    <AccordionPrimitive.Item
      className={cn(accordionVariants.accordionItem({ variant }), className)}
      {...props}
    />
  );
}

/** Trigger component for expanding/collapsing accordion items */
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const { variant, triggerIcon: Icon = ChevronDownIcon } = useAccordionContext();

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(accordionVariants.accordionTrigger({ variant }), className)}
        {...props}
      >
        {children}
        {typeof Icon === "boolean" ? Icon ? <ChevronDownIcon /> : null : <Icon />}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/** Content container for accordion items */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const { variant } = useAccordionContext();

  return (
    <AccordionPrimitive.Content
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn(accordionVariants.accordionContent({ variant }), className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Accordion> &
  AccordionContextProps;

/** Root accordion component */
function Accordion({ triggerIcon, variant, ...props }: AccordionProps) {
  return (
    <AccordionProvider triggerIcon={triggerIcon} variant={variant}>
      <AccordionPrimitive.Root {...props} />
    </AccordionProvider>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, AccordionProvider };