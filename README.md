# react-native-messy

chat ui


## Installation

```sh
npm install @vokhuyet/react-native-messy
```

or

```sh
yarn add @vokhuyet/react-native-messy
```

## Usage

```js
import { Messy } from '@vokhuyet/react-native-messy';

// ...
    const [mess, setMess] = useState([]);

    <Messy
        listProps={{
            ...FlatlistProps
        }}
        messages={mess}
        user={{ id: 2 }}
        footerProps={{
            onSend: async (message) => {
                mess.unshift(message);
                setMess([...mess]);
                // upload image, sent text, emit event...
                setTimeout(() => {
                    mess[0].status = 'sent';
                    setMess([...mess]);
                }, 2000);
            },   
        }}
    />
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
