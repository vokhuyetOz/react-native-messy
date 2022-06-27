import React, {useState} from 'react';

import {Messy} from 'react-native-messy';

const mockMessage = [
  {
    id: '1',
    image: {
      uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
    },
    createdTime: 1654005657790,
    user: {
      id: 1,
      userName: 'Demo',
      avatar: {
        uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
      },
    },
  },
  {
    id: '2',
    createdTime: 165400565790,
    text: '#asdaksdkans @knaskndkasndkasndas vanhung13495@gmail.com 0348641146 https://google.com',
    image: [
      {
        uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
      },
      {
        uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
      },
    ],
    user: {
      id: 2,
      userName: 'Demo',
      avatar: {
        uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
      },
    },
  },
  {
    id: '3',
    createdTime: 1654002565790,
    text: '#asdaksdkans @knaskndkasndkasndas vanhung13495@gmail.com 0348641146 https://google.com',
    user: {
      id: 2,
      userName: 'Demo',
      avatar: {
        uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
      },
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
    image: {
      uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
    },
    status: 'sent',
    user: {
      id: 1,
      userName: 'Demo',
      // avatar: {
      //   uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
      // },
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
    id: '5',
    text: '#asdaksdkans @knaskndkasndkasndas vanhung13495@gmail.com 0348641146 https://google.com',
    user: {
      id: 1,
      userName: 'Demo',
      // avatar: {
      //   uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
      // },
    },
    status: 'seen',

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
];

const App = () => {
  const [mess, setMess] = useState(mockMessage);
  // return null;
  return (
    <Messy
      messages={mess}
      user={{id: 2}}
      footerProps={{
        onSend: message => {
          // Alert.alert(text);
          mess.push({
            user: {
              id: 1,
              userName: 'Demo',
              // avatar: {
              //   uri: 'https://static.remove.bg/remove-bg-web/588fbfdd2324490a4329d4ad22d1bd436e1d384a/assets/start-1abfb4fe2980eabfbbaaa4365a0692539f7cd2725f324f904565a9a744f8e214.jpg',
              // },
            },
            ...message,
          });

          setMess([...mess]);

          // upload image
          //send to server by socket
        },
        enableKeyboardImage: true,
        enableKeyboardAudio: true,
        useSafeArea: false,
      }}
    />
  );
};

export default App;
