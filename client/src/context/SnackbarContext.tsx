import { createContext, useState, ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";

type SnackbarOptions = {
  message: string;
  severity?: "success" | "info" | "warning" | "error";
};

type SnackbarContextType = {
  showSnackbar: (options: SnackbarOptions) => void;
};

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SnackbarOptions>({
    message: "",
    severity: "info",
  });

  const showSnackbar = (options: SnackbarOptions) => {
    setOptions(options);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={options.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {options.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
