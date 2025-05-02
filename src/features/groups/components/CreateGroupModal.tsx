import { CreateGroupComponent } from './CreateGroupComponent';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (groupId: string) => void;
}

export const CreateGroupModal = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}: CreateGroupModalProps) => {
  return (
    <CreateGroupComponent
      isModal={true}
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};