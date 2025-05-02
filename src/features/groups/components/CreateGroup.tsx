
import { CreateGroupComponent } from './CreateGroupComponent';

interface CreateGroupProps {
  onSuccess?: (groupId: string) => void;
}

export const CreateGroup = ({ onSuccess }: CreateGroupProps) => {
  return (
    <CreateGroupComponent
      isModal={false}
      onSuccess={onSuccess}
    />
  );
};
