/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  Image,
  View,
  Pressable,
  Text,
  Keyboard,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { FasterImageView } from '@candlefinance/faster-image';

//@ts-ignore
import { Messy, TMessyMessage } from '@vokhuyet/react-native-messy';

import { MMKVLoader, MMKVInstance } from 'react-native-mmkv-storage';

function ImageV(props) {
  let source = props.source;
  if (typeof props?.source === 'number') {
    return <Image {...props} source={source} />;
  }
  if (props?.source?.uri) {
    source = { ...source, url: source.uri, resizeMode: props.resizeMode };
  }
  return <FasterImageView {...props} source={source} />;
}

export const MMKVwithID: MMKVInstance = new MMKVLoader()
  .withInstanceID('default-mmkv-id')
  .withEncryption()
  .initialize();

const image1 = {
  uri: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
};
const image2 = {
  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN410QNjLLnkMSrQNyi0Z3v8v9Irp6bYtHsAdjGYks-0RtmPVtTPCRXCxRYIG4CGUKo1A&usqp=CAU',
};
const mockMessage = [
  {
    createdTime: 165400565790,
    id: 'aasdasdasdasd',
    type: 'message',
    location: {
      name: 'Roman Plaza',
      image: {
        uri: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
      },
      latitude: '20.9859402',
      longitude: '105.7750793',
    },
  },
  {
    id: '1asdasd',
    image: image1,
    user: {
      id: 2,
      userName: 'Demo',
      avatar: image1,
    },
  },
  {
    id: '1asd',
    image: image2,
    user: {
      id: 1,
      userName: 'Demo',
      avatar: image1,
    },
  },
  {
    id: '2',
    createdTime: 165400565790,
    text: '好きな花は何ですか https://google.com',
    user: {
      id: 2,
      userName: 'Demo',
      avatar: image1,
    },
  },
  {
    id: '2aasdsd',
    createdTime: 165400565790,
    image: [image1, image2],
    user: {
      id: 2,
      userName: 'Demo',
      avatar: image1,
    },
  },
  {
    id: '2aSDASD',
    createdTime: 165400565790,
    image: [image1, image2, image1],
    user: {
      id: 2,
      userName: 'Demo',
      avatar: image1,
    },
  },
  {
    id: 'asdasdasdasd',
    createdTime: 165400565790,
    image: [image1, image2, image1, image2, image1, image2, image1],
    user: {
      id: 2,
      userName: 'Demo',
      avatar: image2,
    },
  },
  {
    id: '3',
    createdTime: 1654002565790,
    text: '#asdaksdkans @knaskndkasndkasndas vanhung13495@gmail.com 0348641146 https://google.com',
    user: {
      id: 2,
      userName: 'Demo',
      avatar: image2,
    },
    seenBy: [
      {
        id: 1,
        userName: 'Demo',
        avatar: {
          uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
        },
      },
      {
        id: 2,
        userName: 'Demo',
        avatar: {
          uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
        },
      },
      {
        id: 3,
        userName: 'Demo',
      },
    ],
  },
  {
    id: '4',
    text: '#asdaksdkans @knaskndkasndkasndas vanhung13495@gmail.com 0348641146 https://google.com',
    status: 'sent',
    user: {
      id: 1,
      userName: 'Demo',
    },
    seenBy: [
      {
        id: 1,
        userName: 'Demo',
        avatar: image1,
      },
      {
        id: 2,
        userName: 'Demo',
        avatar: image1,
      },
      {
        id: 3,
        userName: 'Demo',
      },
    ],
  },
  {
    id: '5',
    text: '好きな花は何ですか',
    user: {
      id: 1,
      userName: 'Demo',
    },
    status: 'seen',

    seenBy: [
      {
        id: 1,
        userName: 'Demo',
        avatar: image1,
      },
      {
        id: 2,
        userName: 'Demo',
        avatar: image1,
      },
      {
        id: 3,
        userName: 'Demo',
      },
    ],
  },
  {
    createdTime: 165400565790,
    id: 'ssss',
    type: 'message',
    video: {
      uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    },
  },
  {
    createdTime: 165400565790,
    id: 'ssss111',
    type: 'message',
    video: {
      uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    },
  },
  {
    createdTime: 165400565790,
    id: 'asdasdasdasdasdasdasda',
    type: 'message',
    video: {
      uri: 'https://storage-hrs001.rabiloo.net/videos/a7a0ee7d34422c5c1374e58259d619b089b1a26978958d530eb3307ad1e5dd7e.mov',
    },
  },
];
function ExtraLeft({ animatedPosition }) {
  const ref = useRef<BottomSheetModal>(null);
  const componentRef = useRef<{ timeout?: NodeJS.Timeout }>({
    timeout: undefined,
  });
  const { dismissAll } = useBottomSheetModal();

  const clear = () => {
    if (componentRef.current.timeout) {
      clearTimeout(componentRef.current.timeout);
    }
  };
  useEffect(() => {
    return clear;
  }, []);
  return (
    <View>
      <Pressable
        onPress={() => {
          dismissAll();
          Keyboard.dismiss();
          clear();
          componentRef.current.timeout = setTimeout(() => {
            ref.current?.present();
          }, 200);
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: 'black',
            marginRight: 4,
          }}
        >
          <Text style={{ alignSelf: 'center', color: 'white' }}>ExtraLeft</Text>
        </View>
      </Pressable>
      <BottomSheetModal
        handleComponent={null}
        ref={ref}
        index={0}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,

          elevation: 6,
        }}
        animationConfigs={{ duration: 300 }}
        snapPoints={[100, '90%']}
        animatedPosition={animatedPosition}
      >
        <Text style={{ alignSelf: 'center' }}>Demo</Text>
      </BottomSheetModal>
    </View>
  );
}
function BasicExample() {
  const [mess, setMess] = useState([...mockMessage.reverse()]);

  const { dismissAll } = useBottomSheetModal();
  return (
    <Messy
      BaseModule={{
        Image: ImageV,
        Cache: {
          get: MMKVwithID.getMap,
          set: MMKVwithID.setMap,
        },
      }}
      messageProps={{
        hideOwnerAvatar: true,
        hidePartnerAvatar: false,
        onPress: () => {
          console.log('press item');
        },
        onLongPress: () => {
          console.log('long press item');
        },
      }}
      listProps={{
        onStartReached: () => {
          console.log('onStartReached');
        },
        onEndReached: () => {
          console.log('onEndReached');
        },
        onPress: () => {
          //hide all bottom sheet modal
          dismissAll();
          //hide keyboard
          Keyboard.dismiss();
        },
      }}
      messages={mess}
      user={{ id: 2 }}
      footerProps={{
        onSend: async (message: TMessyMessage) => {
          message;
          mess.unshift(message);
          setMess([...mess]);
          // upload image
          setTimeout(() => {
            //@ts-ignore
            mess[0].status = 'sent';
            setMess([...mess]);
          }, 2000);

          //send to server by socket
        },
        ExtraLeft: <ExtraLeft />,
      }}
    />
  );
}
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <KeyboardProvider>
            <BasicExample />
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;
