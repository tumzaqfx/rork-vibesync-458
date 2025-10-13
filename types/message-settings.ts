export type MessageRequestFrom = 'no_one' | 'verified' | 'everyone';
export type CallPermission = 'contacts' | 'following' | 'verified' | 'everyone';

export interface MessageSettings {
  messageRequestsFrom: MessageRequestFrom;
  audioVideoCallingEnabled: boolean;
  callPermission: CallPermission;
  alwaysRelayCalls: boolean;
  screenshotProtection: boolean;
}

export const DEFAULT_MESSAGE_SETTINGS: MessageSettings = {
  messageRequestsFrom: 'everyone',
  audioVideoCallingEnabled: true,
  callPermission: 'everyone',
  alwaysRelayCalls: false,
  screenshotProtection: true,
};
