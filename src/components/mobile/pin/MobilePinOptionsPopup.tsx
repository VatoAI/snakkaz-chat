/**
 * MobilePinOptionsPopup Component
 * 
 * A mobile-specific popup component that appears when a message is long-pressed
 * to provide pin/unpin options.
 */
import { Pin, X, Copy, Share2 } from 'lucide-react';

interface MobilePinOptionsPopupProps {
  isVisible: boolean;
  messageId: string | null;
  isPinned: boolean;
  onPinOption: (action: 'pin' | 'unpin') => void;
  onCopyOption?: (messageId: string) => void;
  onShareOption?: (messageId: string) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

export const MobilePinOptionsPopup: React.FC<MobilePinOptionsPopupProps> = ({
  isVisible,
  messageId,
  isPinned,
  onPinOption,
  onCopyOption,
  onShareOption,
  onClose,
  position = { top: 50, left: 50 }
}) => {
  if (!isVisible || !messageId) {
    return null;
  }

  const handlePinOption = () => {
    onPinOption(isPinned ? 'unpin' : 'pin');
  };

  const handleCopyOption = () => {
    if (onCopyOption && messageId) {
      onCopyOption(messageId);
      onClose();
    }
  };

  const handleShareOption = () => {
    if (onShareOption && messageId) {
      onShareOption(messageId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center touch-none" onClick={onClose}>
      <div
        className="absolute bg-cyberdark-850 rounded-lg shadow-lg p-0 animate-fade-in-scale z-50"
        style={{ top: position.top, left: position.left }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col divide-y divide-cyberdark-700 min-w-[180px]">
          <button
            className="flex items-center gap-2 px-4 py-3 hover:bg-cyberdark-800 transition-colors"
            onClick={handlePinOption}
          >
            <Pin size={18} className={isPinned ? 'text-cybergold-400' : 'text-white'} />
            <span className="text-sm">{isPinned ? 'Fjern pin' : 'Pin melding'}</span>
          </button>

          {onCopyOption && (
            <button
              className="flex items-center gap-2 px-4 py-3 hover:bg-cyberdark-800 transition-colors"
              onClick={handleCopyOption}
            >
              <Copy size={18} className="text-white" />
              <span className="text-sm">Kopier tekst</span>
            </button>
          )}

          {onShareOption && (
            <button
              className="flex items-center gap-2 px-4 py-3 hover:bg-cyberdark-800 transition-colors"
              onClick={handleShareOption}
            >
              <Share2 size={18} className="text-white" />
              <span className="text-sm">Del melding</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobilePinOptionsPopup;
