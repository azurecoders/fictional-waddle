import React, { forwardRef } from "react";

const SheetHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`sheet-header ${className}`} {...props}>
    {children}
  </div>
));

export default SheetHeader;
