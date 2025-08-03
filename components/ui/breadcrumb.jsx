import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef((props, ref) => (
  <nav ref={ref} aria-label="breadcrumb" {...props} />
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1 sm:gap-1.5 break-words text-xs sm:text-sm text-muted-foreground lg:gap-2.5 overflow-x-auto scrollbar-hide pb-1",
        className
      )}
      {...rest}
    />
  );
});
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <li
      ref={ref}
      className={cn("inline-flex items-center gap-1 sm:gap-1.5 flex-shrink-0 touch-manipulation min-h-[44px]", className)}
      {...rest}
    />
  );
});
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef((props, ref) => {
  const { asChild, className, ...rest } = props;
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground touch-manipulation py-2 px-1 rounded flex items-center min-h-[44px]", className)}
      {...rest}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground py-2 px-1 min-h-[44px] flex items-center", className)}
      {...rest}
    />
  );
});
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = (props) => {
  const { children, className, ...rest } = props;
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3 sm:[&>svg]:size-3.5 flex items-center min-h-[44px] flex-shrink-0", className)}
      {...rest}
    >
      {children ?? <ChevronRight />}
    </li>
  );
};
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = (props) => {
  const { className, ...rest } = props;
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center min-h-[44px] min-w-[44px] touch-manipulation", className)}
      {...rest}
    >
      <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
      <span className="sr-only">More</span>
    </span>
  );
};
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
