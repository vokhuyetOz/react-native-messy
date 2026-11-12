# Migrating from 0.x

1.0 is a breaking release. The scattered `render*` props are replaced by slots, and `@gorhom/bottom-sheet` is no longer used.

| 0.x | 1.0 |
|---|---|
| `useInBottomSheet` | removed. Put `<Messy>` in any container |
| `BottomSheetModalProvider`, `dismissAll()` | not needed. Use `useMessyComposerActions().dismiss()` |
| `theme: TColor` (`message_left`, `message_right`, ...) | `theme` tokens: `colors.otherBubble`, `colors.ownBubble`, ... |
| `BaseModule.Image` / `.Text` / `.Video` | `components.Image` / `.Text` / `.Video` |
| `BaseModule.Cache` | `cache` |
| `renderMessage` | `components.Message` |
| `renderMessageText` / `Image` / `Video` / `Location` | `components.MessageText` / `MessageImage` / `MessageVideo` / `MessageLocation` |
| `renderMessageOther`, `renderMessageAudio` | `components.MessageCustom` |
| `renderMessageSystem` | `components.SystemMessage` |
| `renderAvatar` | `components.Avatar` |
| `renderMessageDateTime`, `showDateTime` | `components.DaySeparator` |
| `renderLoading` | `components.Loading` |
| `messageProps.hidePartnerAvatar` / `hideOwnerAvatar` | `showAvatar={false}` / `showOwnAvatar` |
| `messageProps.onPress` / `onLongPress` | `onPressMessage` / `onLongPressMessage` |
| `messageProps.renderMessyMessageContentReaction` | `components.Reactions` |
| `reaction.renderItems`, `reaction.renderReactionButton` | `components.ReactionPicker`. Reactions open with a long press |
| `reaction` | `reactions` |
| `footerProps.onSend` | `onSend` |
| `footerProps.renderFooter` | `components.Composer` |
| `footerProps.Send` | `components.SendButton` |
| `footerProps.renderFooterAction`, `ExtraActionLeft` | `components.ComposerActions` |
| `footerProps.ExtraLeft` (+ `animatedPosition`) | `togglePanel(key, node)` from `useMessyComposerActions()` |
| `footerProps.hideFooterAction` / `hideEmoji` / `disabled` / `inputProps` | `composerProps.hideActions` / `hideEmoji` / `disabled` / `inputProps` |
| `setMessyFooterInputText(text)` | `ref.current.setText(text)` |
| `MessyFooterActionLibraryDefault` / `CameraDefault` | `DefaultLibraryButton` / `DefaultCameraButton` |
| `listProps.onPress` | removed. Tapping a message or dragging the list closes the keyboard and panels |

After migrating, see [Customization](customization.md) for how slots replace the old `render*` props.
