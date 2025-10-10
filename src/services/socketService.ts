import { EventEmitter } from 'events';
import { io, Socket } from 'socket.io-client';

interface SocketConfig {
  url: string;
  options?: any;
}

class SocketService extends EventEmitter {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 1000;
  private config: SocketConfig;

  constructor() {
    super();
    this.config = {
      url: process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001',
      options: {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        forceNew: false,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        maxReconnectionAttempts: 5,
      }
    };
  }

  // Connection management
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket && this.isConnected) {
          resolve();
          return;
        }

        const options = {
          ...this.config.options,
          auth: token ? { token } : undefined
        };

        this.socket = io(this.config.url, options);

        this.socket.on('connect', () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connected');
          console.log('Socket connected');
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          this.isConnected = false;
          this.emit('disconnected', reason);
          console.log('Socket disconnected:', reason);
          
          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            this.handleReconnect();
          }
        });

        this.socket.on('connect_error', (error) => {
          this.isConnected = false;
          console.error('Socket connection error:', error);
          this.emit('connectionError', error);
          this.handleReconnect();
          reject(error);
        });

        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
          this.emit('error', error);
        });

        // Set up event forwarding
        this.setupEventForwarding();

      } catch (error) {
        console.error('Failed to connect socket:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.emit('disconnected', 'client_disconnect');
    }
  }

  // Event handling
  private setupEventForwarding(): void {
    if (!this.socket) return;

    // Forward all socket events to our event emitter
    const events = [
      'notification',
      'notificationRead',
      'notificationDeleted',
      'messageReceived',
      'messageUpdated',
      'messageDeleted',
      'conversationUpdated',
      'typingStart',
      'typingStop',
      'userPresence',
      'messageRead',
      'mention',
      'follow',
      'like',
      'comment',
      'cartUpdated',
      'productUpdated',
      'systemAlert'
    ];

    events.forEach(eventName => {
      this.socket!.on(eventName, (data) => {
        this.emit(eventName, data);
      });
    });
  }

  // Send events to server
  emit(eventName: string, data?: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(eventName, data);
    } else {
      console.warn('Socket not connected, cannot emit:', eventName);
    }
  }

  // Reconnection logic
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('reconnectionFailed');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.connect();
      }
    }, delay);
  }

  // Room management
  joinRoom(room: string): void {
    this.emit('join', { room });
  }

  leaveRoom(room: string): void {
    this.emit('leave', { room });
  }

  // Authentication
  authenticate(token: string): void {
    this.emit('authenticate', { token });
  }

  // User presence
  updatePresence(status: 'online' | 'away' | 'busy' | 'offline'): void {
    this.emit('updatePresence', { status });
  }

  // Messaging events
  joinConversation(conversationId: string): void {
    this.joinRoom(`conversation_${conversationId}`);
  }

  leaveConversation(conversationId: string): void {
    this.leaveRoom(`conversation_${conversationId}`);
  }

  // Typing indicators
  startTyping(conversationId: string): void {
    this.emit('typing', { conversationId, typing: true });
  }

  stopTyping(conversationId: string): void {
    this.emit('typing', { conversationId, typing: false });
  }

  // Notifications
  markNotificationRead(notificationId: string): void {
    this.emit('markNotificationRead', { notificationId });
  }

  markAllNotificationsRead(): void {
    this.emit('markAllNotificationsRead');
  }

  deleteNotification(notificationId: string): void {
    this.emit('deleteNotification', { notificationId });
  }

  clearAllNotifications(): void {
    this.emit('clearAllNotifications');
  }

  // Status getters
  isConnected(): boolean {
    return this.isConnected && this.socket !== null;
  }

  getConnectionState(): 'connected' | 'connecting' | 'disconnected' {
    if (!this.socket) return 'disconnected';
    if (this.isConnected) return 'connected';
    return 'connecting';
  }

  // Cleanup
  destroy(): void {
    this.removeAllListeners();
    this.disconnect();
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;