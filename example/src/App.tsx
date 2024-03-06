/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
//@ts-ignore
import { Messy } from '@vokhuyet/react-native-messy';

const image1 = {
  uri: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
};
const image2 = {
  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN410QNjLLnkMSrQNyi0Z3v8v9Irp6bYtHsAdjGYks-0RtmPVtTPCRXCxRYIG4CGUKo1A&usqp=CAU',
};
const mockMessage = [
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
];

const App = () => {
  const [mess, setMess] = useState([...mockMessage.reverse()]);
  // return null;
  return (
    <GestureHandlerRootView style={{ flex: 1, paddingVertical: 16 }}>
      <BottomSheetModalProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardProvider>
            <Messy
              listProps={{
                onStartReached: () => {
                  console.log('onStartReached');
                },
                onEndReached: () => {
                  console.log('onEndReached');
                },
              }}
              messages={mess}
              user={{ id: 2 }}
              footerProps={{
                onSend: async (message: any) => {
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
              }}
            />
          </KeyboardProvider>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
