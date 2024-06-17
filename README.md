# Card Dealer
This is a pair of tools for dealing cards in an OBS browser source, using a Elgato Stream Deck for input
<!-- TODO screenshot -->

## Installation
1. Download the files from the [latest release](https://github.com/Zakini/card-dealer/releases)
   - card-dealer.html
   - com.zakini.card-dealer.streamDeckPlugin
1. Open the Stream Deck app
1. Double click com.zakini.card-dealer.streamDeckPlugin to install it
1. Add the "deal card" action to your stream deck
1. Select the card back and card faces in the action's settings
1. Set up a browser source in OBS using card-dealer.html

## Set up
This is an [npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces) monorepo

```sh
n auto
npm install
```

then run `npm run dev` in `packages/app` and in `packages/stream-deck-plugin`
