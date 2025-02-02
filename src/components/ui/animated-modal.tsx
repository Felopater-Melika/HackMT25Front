"use client";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProps {
  children: ReactNode;
  closeOnOutsideClick?: boolean;
}

export function Modal({ children, closeOnOutsideClick = true }: ModalProps) {
  // Pass closeOnOutsideClick as a prop to ModalBody
  return (
    <ModalProvider>
      {React.cloneElement(children as any, { closeOnOutsideClick })}
    </ModalProvider>
  );
}

export const ModalTrigger = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { setOpen } = useModal();
  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-md px-4 py-2 text-center text-black dark:text-white",
        className,
      )}
      onClick={() => setOpen(true)}
    >
      {children}
    </button>
  );
};

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
}

export const ModalBody = ({
  children,
  className,
  closeOnOutsideClick = true,
}: ModalBodyProps) => {
  const { open, setOpen } = useModal();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const modalRef = useRef<HTMLDivElement>(null);
  if (closeOnOutsideClick) {
    useOutsideClick(modalRef, () => setOpen(false));
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-50 flex h-full w-full items-center justify-center [perspective:800px] [transform-style:preserve-3d]"
        >
          <Overlay />
          <motion.div
            ref={modalRef}
            // Enlarged modal: 90vw wide and 80vh high
            className={cn(
              "relative z-50 flex min-h-[80vh] w-full max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-transparent bg-white dark:border-neutral-800 dark:bg-neutral-950",
              className,
            )}
            initial={{ opacity: 0, scale: 0.5, rotateX: 40, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
          >
            {/* Remove CloseIcon so modal only closes on submit button */}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-1 flex-col p-8 md:p-10", className)}>
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex justify-end bg-gray-100 p-4 dark:bg-neutral-900",
        className,
      )}
    >
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className={`fixed inset-0 z-50 h-full w-full bg-black bg-opacity-50 ${className}`}
    ></motion.div>
  );
};

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: Function,
) => {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
