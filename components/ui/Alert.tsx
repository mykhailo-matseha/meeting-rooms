import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
}
export default function Alert({ children }: AlertProps) {
  return (
    <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl p-3 text-center">
      {children}
    </div>
  );
}
