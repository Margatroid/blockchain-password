# Blockchain Password
Open source experimental password manager built on the Ethereum blockchain.

## Docker quickstart

The easiest way to get your own copy of the frontend running is via Docker.
```
docker build -t blockchain-password .
docker run -d -p 8080:80 blockchain-password
```
The frontend will run on port 8080 and you're ready to use this with any Ethereum network.

## Development prerequisites

You will need the following dependencies for local development:
- Truffle
- Node along with npm

## Tests

To run the Truffle tests for the smart contracts you will need to start a development blockchain:
```
truffle develop
```
Now you can run `truffle test` in another shell or just `test` inside the `truffle develop` CLI.

The frontend tests can be run with:
```
cd docs
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
