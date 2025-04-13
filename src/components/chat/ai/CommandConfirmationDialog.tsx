import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommandConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CommandConfirmationDialog = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel
}: CommandConfirmationDialogProps) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-cyberdark-800 border-cybergold-500/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-cybergold-300">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-cybergold-200">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            className="bg-cyberdark-700 text-cybergold-300 hover:bg-cyberdark-600"
          >
            Avbryt
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-cyberblue-600 text-white hover:bg-cyberblue-500"
          >
            Bekreft
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};