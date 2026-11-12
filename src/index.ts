export { Messy, defaultComponents } from './Messy';
export { defaultTheme, darkTheme, mergeTheme } from './theme';
export { useMessy, useMessyTheme, useMessyComponents } from './context';
export {
  useMessyComposer,
  useMessyComposerActions,
} from './components/composer/ComposerContext';
export type {
  TMessyComposerActions,
  TMessyComposerPanel,
} from './components/composer/ComposerContext';
export { buildItems } from './core/grouping';
export {
  DEFAULT_REACTIONS,
  DEFAULT_TEXTS,
  displayName,
  groupReactions,
  previewText,
} from './core/helpers';

// default slots, exported so they can be wrapped instead of rewritten
export { DefaultMessage } from './components/message/Message';
export {
  DefaultAvatar,
  DefaultBubble,
  DefaultDaySeparator,
  DefaultMessageReply,
  DefaultMessageStatus,
  DefaultReactions,
  DefaultSenderName,
  DefaultSystemMessage,
  DefaultThreadSummary,
} from './components/message/parts';
export {
  DefaultMessageCustom,
  DefaultMessageImage,
  DefaultMessageLocation,
  DefaultMessageText,
  DefaultMessageVideo,
} from './components/message/content';
export {
  ComposerIconButton,
  DefaultComposer,
  DefaultReplyPreview,
  DefaultSendButton,
} from './components/composer/Composer';
export {
  DefaultCameraButton,
  DefaultComposerActions,
  DefaultLibraryButton,
} from './components/composer/Attachments';
export type { TMessyAttachmentButtonProps } from './components/composer/Attachments';
export { DefaultEmojiPanel } from './components/composer/EmojiPanel';
export {
  DefaultMediaViewer,
  DefaultReactionPicker,
  DefaultScrollToBottomButton,
} from './components/overlays';
export {
  DefaultLoading,
  MAutoImage,
  MImage,
  MText,
  MVideo,
} from './components/primitives';

export type * from './types';
