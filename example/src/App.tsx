import React, { useRef, useState } from 'react';
import { Platform, Pressable, Text, View, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  Messy,
  darkTheme,
  DefaultComposerActions,
  useMessyComposerActions,
  useMessyTheme,
  type TMessyMessage,
  type TMessyLayout,
  type TMessyRef,
  type TMessyMediaSize,
} from '@vokhuyet/react-native-messy';

// any key-value store works (MMKV getMap/setMap, AsyncStorage wrapper...)
const sizes = new Map<string, TMessyMediaSize>();
const cache = {
  get: (key: string) => sizes.get(key),
  set: (key: string, value: TMessyMediaSize) => sizes.set(key, value),
};

const me = { id: 2, userName: 'Alex' };
const sam = {
  id: 1,
  userName: 'Sam',
  avatar: {
    uri: 'https://picsum.photos/id/64/200/200',
  },
};
const kim = { id: 3, userName: 'Kim' };
const image1 = {
  uri: 'https://picsum.photos/id/1015/1200/800',
};
const image2 = {
  uri: 'https://picsum.photos/id/1002/1200/800',
};
const ago = (min: number) => Date.now() - min * 60 * 1000;

// newest first
const initialMessages: TMessyMessage[] = [
  {
    id: '12',
    text: 'Oh you better be 😄',
    user: me,
    createdTime: ago(1),
    status: 'seen',
    seenBy: [sam, kim],
  },
  {
    id: '11',
    text: "i'm gonna sing my heart out fr",
    user: sam,
    replies: { count: 2, users: [kim, me] },
    createdTime: ago(2),
  },
  {
    id: '10',
    text: 'of course! see u there, bud.',
    user: sam,
    createdTime: ago(3),
    reactions: [{ id: 'r1', user: me, reaction: { key: 'love', value: '❤️' } }],
  },
  { id: '9', type: 'system', text: 'Kim joined the chat', createdTime: ago(4) },
  {
    id: '8',
    text: 'This event is gonna be sooo much fun! 🔥 https://example.com',
    user: me,
    createdTime: ago(5),
  },
  { id: '7', image: image1, user: me, createdTime: ago(6) },
  {
    id: '6',
    text: 'Hey, u coming this friday?',
    user: me,
    createdTime: ago(7),
  },
  {
    id: '5',
    image: [image1, image2, image1, image2, image1],
    user: kim,
    createdTime: ago(60 * 24),
  },
  {
    id: '4',
    video: {
      uri: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    },
    user: sam,
    createdTime: ago(60 * 24 + 1),
  },
  {
    id: '3',
    location: {
      name: 'Roman Plaza',
      image: image2,
      latitude: '20.9859402',
      longitude: '105.7750793',
    },
    user: sam,
    createdTime: ago(60 * 24 + 2),
  },
  {
    id: '2',
    text: 'call me 0348641146 or mail demo@example.com',
    user: kim,
    createdTime: ago(60 * 48),
    reactions: [
      { id: 'r2', user: sam, reaction: { key: 'haha', value: '😂' } },
      { id: 'r3', user: me, reaction: { key: 'haha', value: '😂' } },
    ],
  },
  { id: '1', text: 'Welcome 👋', user: kim, createdTime: ago(60 * 48 + 1) },
];

/** A custom panel opened from the composer, replacing the old ExtraLeft sheet. */
function StickerPanel() {
  const theme = useMessyTheme();
  const { send, closePanel } = useMessyComposerActions();
  return (
    <View
      style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 16 }}
    >
      {['🐶', '🐱', '🦊', '🐼', '🐸', '🐵'].map((s) => (
        <Pressable
          key={s}
          onPress={() => {
            send({ text: s });
            closePanel();
          }}
          style={{ padding: 12 }}
        >
          <Text style={{ fontSize: 48, color: theme.colors.text }}>{s}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function ComposerActions() {
  const theme = useMessyTheme();
  const { togglePanel } = useMessyComposerActions();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable
        accessibilityLabel="Stickers"
        hitSlop={6}
        onPress={() => togglePanel('stickers', <StickerPanel />)}
        style={{ paddingHorizontal: 8 }}
      >
        <Text style={{ fontSize: 24, color: theme.colors.textSecondary }}>
          +
        </Text>
      </Pressable>
      <DefaultComposerActions />
    </View>
  );
}

// demo theme mirrors the Mobbin reference (Cal AI): near-black accent, white input
const calAiLike = {
  colors: { primary: '#111111', ownBubble: '#111111', surface: '#FFFFFF' },
};

// slots are defined once, outside render
const components = { ComposerActions };

// shortcut: fixed home-indicator inset; real apps pass useSafeAreaInsets().bottom
const BOTTOM_INSET = Platform.OS === 'ios' ? 34 : 0;

function Toggle({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: '#8884',
      }}
    >
      <Text style={{ fontSize: 13, color: '#888' }}>{label}</Text>
    </Pressable>
  );
}

function ChatExample() {
  const [messages, setMessages] = useState(initialMessages);
  const [layout, setLayout] = useState<TMessyLayout>('bubble');
  const [dark, setDark] = useState(false);
  const messyRef = useRef<TMessyRef>(null);

  const update = (id: TMessyMessage['id'], patch: Partial<TMessyMessage>) =>
    setMessages((list) =>
      list.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );

  return (
    <View style={{ flex: 1, backgroundColor: dark ? 'black' : 'white' }}>
      <SafeAreaView />
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          padding: 8,
          justifyContent: 'center',
        }}
      >
        <Toggle
          label={layout === 'bubble' ? 'Two-sided' : 'One-sided'}
          onPress={() => setLayout(layout === 'bubble' ? 'list' : 'bubble')}
        />
        <Toggle
          label={dark ? 'Dark' : 'Light'}
          onPress={() => setDark(!dark)}
        />
        <Toggle
          label="Prefill"
          onPress={() => messyRef.current?.setText('Hello from ref! ')}
        />
      </View>
      <Messy
        ref={messyRef}
        messages={messages}
        user={me}
        layout={layout}
        theme={dark ? darkTheme : calAiLike}
        components={components}
        showSenderName
        composerProps={{ bottomInset: BOTTOM_INSET }}
        cache={cache}
        onSend={(message) => {
          setMessages((list) => [message, ...list]);
          // pretend the server acknowledged it
          setTimeout(() => update(message.id, { status: 'sent' }), 1500);
        }}
        onPressMessage={(m) => console.log('press', m.id)}
        onPressReplies={(m) => console.log('open thread', m.id)}
        reactions={{
          onPress: ({ message, reaction }) => {
            const others = (message.reactions ?? []).filter(
              (r) => !(r.user?.id === me.id && r.reaction.key === reaction.key)
            );
            const removed = others.length !== (message.reactions ?? []).length;
            update(message.id, {
              reactions: removed
                ? others
                : [...others, { id: `${Date.now()}`, user: me, reaction }],
            });
          },
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <ChatExample />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
