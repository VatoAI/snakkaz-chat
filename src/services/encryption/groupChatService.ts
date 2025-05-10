/**
 * Group Chat Service for Snakkaz Chat
 * 
 * This service handles encrypted group messaging and management
 */

import { EncryptionService, SecurityLevel, EncryptionType } from './encryptionService';

// Group member roles
export enum GroupRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member'
}

// Group security levels
export enum GroupSecurityLevel {
  STANDARD = 'standard',    // Server-side encryption
  ENHANCED = 'enhanced',    // E2EE for messages
  PREMIUM = 'premium'       // E2EE for messages and media with ephemeral keys
}

// Group member
export interface GroupMember {
  id: string;
  role: GroupRole;
  joinedAt: Date;
  displayName?: string;
  publicKey?: string;         // Public key for E2EE
}

// Group settings
export interface GroupSettings {
  name: string;
  description?: string;
  avatar?: string;
  securityLevel: GroupSecurityLevel;
  allowMediaSharing: boolean;
  allowLinkPreviews: boolean;
  allowMemberInvites: boolean;
  allowScreenshots: boolean;  // Whether to allow screenshots
  messageRetentionDays: number; // Number of days to retain messages
  isPrivate: boolean;         // Whether the group is private (invite-only)
  maxMembers: number;         // Maximum number of members
  requireEncryption: boolean; // Whether to require E2EE
}

// Default group settings
const DEFAULT_GROUP_SETTINGS: GroupSettings = {
  name: 'New Group',
  securityLevel: GroupSecurityLevel.ENHANCED,
  allowMediaSharing: true,
  allowLinkPreviews: true,
  allowMemberInvites: false,
  allowScreenshots: true,
  messageRetentionDays: 30,
  isPrivate: true,
  maxMembers: 50,
  requireEncryption: true
};

// Group message
export interface GroupMessage {
  id: string;
  sender: {
    id: string;
    displayName?: string;
  };
  content: string;          // Encrypted or plain content
  timestamp: Date;
  encryptionInfo?: {        // Present if message is encrypted
    isEncrypted: true;
    keyId: string;
    algorithm: string;
  };
  mediaAttachments?: {
    url: string;
    type: string;
    name: string;
    thumbnailUrl?: string;
    encryptionInfo?: {
      isEncrypted: true;
      keyId: string;
    };
  }[];
  referencedMessage?: {     // For replies
    id: string;
    snippet: string;
  };
  readBy?: string[];        // List of member IDs who read the message
  deliveredTo?: string[];   // List of member IDs the message was delivered to
  isEdited?: boolean;       // Whether the message has been edited
  isDeleted?: boolean;      // Whether the message has been deleted
  reactions?: {
    emoji: string;
    count: number;
    userIds: string[];
  }[];
}

// Group info
export interface Group {
  id: string;
  settings: GroupSettings;
  createdAt: Date;
  createdBy: string;        // User ID who created the group
  members: GroupMember[];
  encryptionKeys?: {        // Present for E2EE groups
    groupKeyId: string;     // Current active group key ID
    rotatedAt: Date;        // When the key was last rotated
    keyVersion: number;     // Key version
  };
}

export class GroupChatService {
  private encryptionService: EncryptionService;
  
  constructor() {
    this.encryptionService = new EncryptionService();
  }
  
  /**
   * Create a new group with encryption
   */
  public async createGroup(
    name: string,
    creator: { id: string, displayName?: string, publicKey?: string },
    settings?: Partial<GroupSettings>
  ): Promise<Group> {
    const groupSettings: GroupSettings = {
      ...DEFAULT_GROUP_SETTINGS,
      ...settings,
      name
    };
    
    // Generate a unique group ID
    const groupId = this.generateGroupId();
    
    // Add creator as admin
    const creatorMember: GroupMember = {
      id: creator.id,
      role: GroupRole.ADMIN,
      joinedAt: new Date(),
      displayName: creator.displayName,
      publicKey: creator.publicKey
    };
    
    // Create the group
    const group: Group = {
      id: groupId,
      settings: groupSettings,
      createdAt: new Date(),
      createdBy: creator.id,
      members: [creatorMember]
    };
    
    // Generate encryption keys if required
    if (groupSettings.requireEncryption || 
        groupSettings.securityLevel === GroupSecurityLevel.ENHANCED ||
        groupSettings.securityLevel === GroupSecurityLevel.PREMIUM) {
      
      const { keyId } = await this.generateGroupEncryptionKey(group);
      
      group.encryptionKeys = {
        groupKeyId: keyId,
        rotatedAt: new Date(),
        keyVersion: 1
      };
    }
    
    // Save the group to the database
    await this.saveGroup(group);
    
    return group;
  }
  
  /**
   * Add a member to a group
   */
  public async addGroupMember(
    groupId: string,
    userId: string,
    role: GroupRole = GroupRole.MEMBER,
    addedByUserId: string
  ): Promise<GroupMember> {
    // Get the group
    const group = await this.getGroup(groupId);
    
    // Check if the user adding has permission
    const addingUser = group.members.find(m => m.id === addedByUserId);
    
    if (!addingUser || (addingUser.role !== GroupRole.ADMIN && addingUser.role !== GroupRole.MODERATOR)) {
      throw new Error('You do not have permission to add members to this group');
    }
    
    // Check if user is already a member
    if (group.members.some(m => m.id === userId)) {
      throw new Error('User is already a member of this group');
    }
    
    // Check if group is at max capacity
    if (group.members.length >= group.settings.maxMembers) {
      throw new Error(`Group has reached maximum capacity of ${group.settings.maxMembers} members`);
    }
    
    // Get user information (in a real implementation, this would fetch from the database)
    const user = await this.getUserInfo(userId);
    
    // Add the member
    const newMember: GroupMember = {
      id: userId,
      role,
      joinedAt: new Date(),
      displayName: user.displayName,
      publicKey: user.publicKey
    };
    
    group.members.push(newMember);
    
    // Save the updated group
    await this.saveGroup(group);
    
    // If the group uses encryption, send the key to the new member
    if (group.encryptionKeys) {
      await this.shareGroupKeyWithMember(group, newMember);
    }
    
    return newMember;
  }
  
  /**
   * Send a message to a group
   */
  public async sendGroupMessage(
    groupId: string, 
    senderId: string, 
    content: string,
    mediaAttachments?: Array<{
      file: File;
      type: string;
    }>
  ): Promise<GroupMessage> {
    // Get the group
    const group = await this.getGroup(groupId);
    
    // Check if the sender is a member
    const sender = group.members.find(m => m.id === senderId);
    
    if (!sender) {
      throw new Error('You are not a member of this group');
    }
    
    // Generate a unique message ID
    const messageId = this.generateMessageId();
    
    // Initial message object
    let message: GroupMessage = {
      id: messageId,
      sender: {
        id: senderId,
        displayName: sender.displayName
      },
      content,
      timestamp: new Date()
    };
    
    // Encrypt the message if the group requires it
    if (group.encryptionKeys) {
      const encryptedContent = await this.encryptGroupMessage(content, group);
      
      message.content = encryptedContent.encryptedData;
      message.encryptionInfo = {
        isEncrypted: true,
        keyId: encryptedContent.keyId,
        algorithm: 'AES-GCM'  // Example algorithm
      };
    }
    
    // Process media attachments if any
    if (mediaAttachments && mediaAttachments.length > 0 && group.settings.allowMediaSharing) {
      message.mediaAttachments = await Promise.all(
        mediaAttachments.map(async attachment => {
          // In a real implementation, this would upload to storage
          const uploadResult = await this.uploadGroupMedia(attachment.file, group);
          
          return {
            url: uploadResult.url,
            type: attachment.type,
            name: attachment.file.name,
            thumbnailUrl: uploadResult.thumbnailUrl,
            encryptionInfo: uploadResult.encrypted ? {
              isEncrypted: true,
              keyId: uploadResult.keyId || ''
            } : undefined
          };
        })
      );
    }
    
    // Save the message to the database
    await this.saveGroupMessage(groupId, message);
    
    return message;
  }
  
  /**
   * Get messages for a group
   */
  public async getGroupMessages(
    groupId: string,
    userId: string,
    limit: number = 50,
    beforeMessageId?: string
  ): Promise<GroupMessage[]> {
    // Check if user is a member
    const group = await this.getGroup(groupId);
    
    if (!group.members.some(m => m.id === userId)) {
      throw new Error('You are not a member of this group');
    }
    
    // Get messages from database
    const messages = await this.fetchGroupMessages(groupId, limit, beforeMessageId);
    
    // Mark messages as delivered to this user
    await this.markMessagesAsDelivered(groupId, messages.map(m => m.id), userId);
    
    return messages;
  }
  
  /**
   * Mark a message as read
   */
  public async markMessageAsRead(
    groupId: string,
    messageId: string,
    userId: string
  ): Promise<void> {
    // Get the message
    const message = await this.getGroupMessage(groupId, messageId);
    
    // Check if already marked as read
    if (message.readBy && message.readBy.includes(userId)) {
      return;
    }
    
    // Add user to readBy array
    if (!message.readBy) {
      message.readBy = [];
    }
    
    message.readBy.push(userId);
    
    // Save updated message
    await this.saveGroupMessage(groupId, message);
  }
  
  /**
   * Apply a reaction to a message
   */
  public async addReaction(
    groupId: string,
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<void> {
    // Get the message
    const message = await this.getGroupMessage(groupId, messageId);
    
    // Initialize reactions array if it doesn't exist
    if (!message.reactions) {
      message.reactions = [];
    }
    
    // Check if reaction already exists
    let reaction = message.reactions.find(r => r.emoji === emoji);
    
    if (reaction) {
      // Check if user already reacted
      if (!reaction.userIds.includes(userId)) {
        reaction.userIds.push(userId);
        reaction.count++;
      }
    } else {
      // Add new reaction
      message.reactions.push({
        emoji,
        count: 1,
        userIds: [userId]
      });
    }
    
    // Save updated message
    await this.saveGroupMessage(groupId, message);
  }
  
  /**
   * Delete a message
   */
  public async deleteMessage(
    groupId: string,
    messageId: string,
    userId: string
  ): Promise<void> {
    // Get the message and group
    const message = await this.getGroupMessage(groupId, messageId);
    const group = await this.getGroup(groupId);
    
    // Check if user has permission to delete
    const member = group.members.find(m => m.id === userId);
    
    if (!member) {
      throw new Error('You are not a member of this group');
    }
    
    // Allow deletion if:
    // 1. User is the sender
    // 2. User is an admin or moderator
    if (message.sender.id !== userId && 
        member.role !== GroupRole.ADMIN && 
        member.role !== GroupRole.MODERATOR) {
      throw new Error('You do not have permission to delete this message');
    }
    
    // Mark as deleted
    message.isDeleted = true;
    message.content = '[Message deleted]';
    
    // Clear any attachments
    delete message.mediaAttachments;
    
    // Save updated message
    await this.saveGroupMessage(groupId, message);
  }
  
  /**
   * Leave a group
   */
  public async leaveGroup(
    groupId: string,
    userId: string
  ): Promise<void> {
    // Get the group
    const group = await this.getGroup(groupId);
    
    // Check if user is a member
    const memberIndex = group.members.findIndex(m => m.id === userId);
    
    if (memberIndex === -1) {
      throw new Error('You are not a member of this group');
    }
    
    // Check if user is the last admin
    const isLastAdmin = 
      group.members[memberIndex].role === GroupRole.ADMIN &&
      group.members.filter(m => m.role === GroupRole.ADMIN).length === 1;
    
    if (isLastAdmin) {
      // Promote a moderator to admin if available
      const moderator = group.members.find(m => m.role === GroupRole.MODERATOR && m.id !== userId);
      
      if (moderator) {
        moderator.role = GroupRole.ADMIN;
      } else {
        // Promote a regular member if no moderator
        const member = group.members.find(m => m.id !== userId);
        
        if (member) {
          member.role = GroupRole.ADMIN;
        } else {
          // User is the last member, delete the group
          await this.deleteGroup(groupId);
          return;
        }
      }
    }
    
    // Remove the member
    group.members.splice(memberIndex, 1);
    
    // Save the updated group
    await this.saveGroup(group);
    
    // Rotate encryption keys if needed for security
    if (group.encryptionKeys && group.settings.securityLevel === GroupSecurityLevel.PREMIUM) {
      await this.rotateGroupKey(group);
    }
  }
  
  /**
   * Update group settings
   */
  public async updateGroupSettings(
    groupId: string,
    userId: string,
    settings: Partial<GroupSettings>
  ): Promise<Group> {
    // Get the group
    const group = await this.getGroup(groupId);
    
    // Check if user has permission
    const member = group.members.find(m => m.id === userId);
    
    if (!member || member.role !== GroupRole.ADMIN) {
      throw new Error('You do not have permission to update group settings');
    }
    
    // Update settings
    group.settings = {
      ...group.settings,
      ...settings
    };
    
    // If changing security level, handle key changes
    if (settings.securityLevel && 
        settings.securityLevel !== group.settings.securityLevel) {
      
      if (settings.securityLevel === GroupSecurityLevel.STANDARD) {
        // Removing encryption
        delete group.encryptionKeys;
      } else if (!group.encryptionKeys) {
        // Adding encryption
        const { keyId } = await this.generateGroupEncryptionKey(group);
        
        group.encryptionKeys = {
          groupKeyId: keyId,
          rotatedAt: new Date(),
          keyVersion: 1
        };
      } else if (settings.securityLevel === GroupSecurityLevel.PREMIUM) {
        // Upgrading to premium security, rotate keys
        await this.rotateGroupKey(group);
      }
    }
    
    // Save updated group
    await this.saveGroup(group);
    
    return group;
  }
  
  // PRIVATE METHODS
  
  /**
   * Generate a unique group ID
   */
  private generateGroupId(): string {
    return `grp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  /**
   * Generate a unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  /**
   * Generate an encryption key for a group
   */
  private async generateGroupEncryptionKey(group: Group): Promise<{ key: string; keyId: string }> {
    const securityLevel = group.settings.securityLevel === GroupSecurityLevel.PREMIUM ? 
      SecurityLevel.P2P_E2EE : SecurityLevel.E2EE;
    
    const key = this.encryptionService.generateRandomString(32);
    const keyId = `gk_${group.id}_${Date.now().toString(36)}`;
    
    // In a real implementation, this would securely store the key
    // and share it with all group members
    
    return { key, keyId };
  }
  
  /**
   * Encrypt a message for a group
   */
  private async encryptGroupMessage(
    content: string,
    group: Group
  ): Promise<{ encryptedData: string; keyId: string }> {
    // In a real implementation, this would use the group's encryption key
    // to encrypt the message
    
    // Placeholder implementation
    const encryptionResult = await this.encryptionService.encrypt(
      content,
      SecurityLevel.E2EE,
      EncryptionType.MESSAGE
    );
    
    return {
      encryptedData: encryptionResult.encryptedData,
      keyId: encryptionResult.keyId
    };
  }
  
  /**
   * Upload media for a group message
   */
  private async uploadGroupMedia(file: File, group: Group): Promise<{
    url: string;
    thumbnailUrl?: string;
    encrypted: boolean;
    keyId?: string;
  }> {
    // In a real implementation, this would:
    // 1. Compress the image/video if needed
    // 2. Encrypt the file if needed
    // 3. Upload to storage
    // 4. Return URLs
    
    // Placeholder implementation
    const shouldEncrypt = group.settings.securityLevel !== GroupSecurityLevel.STANDARD;
    const fileId = `${Date.now()}_${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
    
    let keyId: string | undefined;
    
    if (shouldEncrypt) {
      keyId = `fk_${group.id}_${Date.now().toString(36)}`;
    }
    
    return {
      url: `https://storage.snakkaz.com/group-media/${group.id}/${fileId}`,
      thumbnailUrl: file.type.startsWith('image/') ? 
        `https://storage.snakkaz.com/group-media/${group.id}/thumbnails/${fileId}` : undefined,
      encrypted: shouldEncrypt,
      keyId
    };
  }
  
  /**
   * Share a group encryption key with a member
   */
  private async shareGroupKeyWithMember(group: Group, member: GroupMember): Promise<void> {
    // In a real implementation, this would:
    // 1. Get the group's encryption key
    // 2. Encrypt it with the member's public key
    // 3. Send it to the member securely
    
    // This is just a placeholder
    console.log(`Sharing group key for ${group.id} with member ${member.id}`);
  }
  
  /**
   * Rotate a group's encryption key
   */
  private async rotateGroupKey(group: Group): Promise<void> {
    if (!group.encryptionKeys) {
      return;
    }
    
    // Generate a new key
    const { keyId } = await this.generateGroupEncryptionKey(group);
    
    // Update group encryption info
    group.encryptionKeys = {
      groupKeyId: keyId,
      rotatedAt: new Date(),
      keyVersion: (group.encryptionKeys.keyVersion || 0) + 1
    };
    
    // Save updated group
    await this.saveGroup(group);
    
    // Share the new key with all members
    // In a real implementation, this would encrypt the key for each member
    
    console.log(`Rotated encryption key for group ${group.id}`);
  }
  
  /**
   * Mark messages as delivered to a user
   */
  private async markMessagesAsDelivered(
    groupId: string,
    messageIds: string[],
    userId: string
  ): Promise<void> {
    // In a real implementation, this would update each message in the database
    
    // This is just a placeholder
    console.log(`Marking ${messageIds.length} messages as delivered to ${userId} in group ${groupId}`);
  }
  
  // DATABASE METHODS
  // These would be replaced with actual database calls
  
  /**
   * Get a group from the database
   */
  private async getGroup(groupId: string): Promise<Group> {
    // In a real implementation, this would fetch from the database
    // This is just a placeholder
    return {
      id: groupId,
      settings: {
        ...DEFAULT_GROUP_SETTINGS,
        name: 'Test Group'
      },
      createdAt: new Date(),
      createdBy: 'user123',
      members: [
        {
          id: 'user123',
          role: GroupRole.ADMIN,
          joinedAt: new Date()
        }
      ]
    };
  }
  
  /**
   * Save a group to the database
   */
  private async saveGroup(group: Group): Promise<void> {
    // In a real implementation, this would save to the database
    // This is just a placeholder
    console.log(`Saving group: ${JSON.stringify(group)}`);
  }
  
  /**
   * Get user information
   */
  private async getUserInfo(userId: string): Promise<{
    id: string;
    displayName?: string;
    publicKey?: string;
  }> {
    // In a real implementation, this would fetch from the database
    // This is just a placeholder
    return {
      id: userId,
      displayName: `User ${userId.substring(0, 4)}`,
      publicKey: `pk_${userId}_${Date.now()}`
    };
  }
  
  /**
   * Delete a group
   */
  private async deleteGroup(groupId: string): Promise<void> {
    // In a real implementation, this would delete from the database
    // This is just a placeholder
    console.log(`Deleting group ${groupId}`);
  }
  
  /**
   * Save a group message to the database
   */
  private async saveGroupMessage(groupId: string, message: GroupMessage): Promise<void> {
    // In a real implementation, this would save to the database
    // This is just a placeholder
    console.log(`Saving message to group ${groupId}: ${JSON.stringify(message)}`);
  }
  
  /**
   * Get a group message from the database
   */
  private async getGroupMessage(groupId: string, messageId: string): Promise<GroupMessage> {
    // In a real implementation, this would fetch from the database
    // This is just a placeholder
    return {
      id: messageId,
      sender: {
        id: 'user123',
        displayName: 'Test User'
      },
      content: 'Test message',
      timestamp: new Date()
    };
  }
  
  /**
   * Fetch group messages from the database
   */
  private async fetchGroupMessages(
    groupId: string,
    limit: number,
    beforeMessageId?: string
  ): Promise<GroupMessage[]> {
    // In a real implementation, this would fetch from the database
    // This is just a placeholder
    return [
      {
        id: `msg_${Date.now() - 1000}`,
        sender: {
          id: 'user123',
          displayName: 'Test User'
        },
        content: 'Test message 1',
        timestamp: new Date(Date.now() - 1000)
      },
      {
        id: `msg_${Date.now() - 2000}`,
        sender: {
          id: 'user456',
          displayName: 'Another User'
        },
        content: 'Test message 2',
        timestamp: new Date(Date.now() - 2000)
      }
    ];
  }
}

// Export a default instance
export const groupChatService = new GroupChatService();
