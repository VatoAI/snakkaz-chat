export const useP2PDelivery = () => {
  const handleP2PDelivery = async (
    webRTCManager: any,
    onlineUsers: Set<string>,
    userId: string,
    message: string
  ) => {
    let p2pDeliveryCount = 0;
    const peerPromises: Promise<boolean>[] = [];
    const peerErrors: Record<string, string> = {};

    for (const peerId of onlineUsers) {
      if (peerId !== userId) {
        const timeoutPromise = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 10000));
        const sendPromise = new Promise<boolean>(async (resolve) => {
          try {
            const isReady = await webRTCManager.ensurePeerReady(peerId);
            if (isReady) {
              await webRTCManager.sendMessage(peerId, message.trim());
              resolve(true);
            } else {
              peerErrors[peerId] = 'Peer not ready';
              resolve(false);
            }
          } catch (error) {
            peerErrors[peerId] = error instanceof Error ? error.message : 'Unknown error';
            resolve(false);
          }
        });
        peerPromises.push(Promise.race([sendPromise, timeoutPromise]));
      }
    }

    const results = await Promise.all(peerPromises);
    p2pDeliveryCount = results.filter(result => result).length;
    if (p2pDeliveryCount === 0 && onlineUsers.size > 1) {
      console.warn('Failed to deliver message to any peers:', peerErrors);
    }
    return p2pDeliveryCount;
  };

  return { handleP2PDelivery };
};
