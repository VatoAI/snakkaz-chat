
import { Button } from "@/components/ui/button";

interface PinKeypadProps {
  onNumberPress: (num: number) => void;
  onDelete: () => void;
}

export const PinKeypad = ({ onNumberPress, onDelete }: PinKeypadProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, index) => (
        <Button
          key={num}
          type="button"
          onClick={() => onNumberPress(num)}
          className={`py-4 text-xl font-medium bg-cyberdark-800 hover:bg-cyberdark-700 border border-cybergold-500/20
                    ${index === 9 ? 'col-start-2' : ''}`}
        >
          {num}
        </Button>
      ))}
      <Button
        type="button"
        onClick={onDelete}
        className="py-4 text-xl font-medium bg-cyberdark-800 hover:bg-cyberred-900/50 text-cyberred-400 border border-cybergold-500/20"
      >
        ←
      </Button>
    </div>
  );
};
