# DJBlockChain
A simple blockchain implementation.
This uses the (v12.2+) nodejs built-in [crypto library](https://nodejs.org/api/crypto.html).
Included is a mundane version of a blockchain with transactions, user wallets, and a proof-of-work mechanism.
The proof-of-work mechanism utilizes [MD5](https://en.wikipedia.org/wiki/MD5) hashing algorithm instead of SHA256 to make computation quicker for demonstration purposes.

## Setup
Install packages with `npm install`

## Build
Create a build with `npm run dev`. This starts the build in watch mode to automatically recompile when you save changes.

## Run
Use `npm run start`
