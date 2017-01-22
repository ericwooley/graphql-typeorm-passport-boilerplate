## Prerequiset Knowledge
1. Learn typescript, lynda and egghead.io have great tutorials. Or check the main website.
2. Learn typescripts async/await.
3. Learn [GraphQL](http://graphql.org/graphql-js/)

## Libraries
3. [typeorm](https://typeorm.github.io/)
4. [sinon](http://sinonjs.org/docs/)
5. [mocha](https://mochajs.org/)

## Dependencies

1. Node 6

## Getting started

1. run `npm install`

## Developing

1. run `npm run dev`

	This should open a node server on [port 8090](http://localhost:8090),
	and will run the tests and reload any time you make a change.

2. graphiql should be available at [here](http://localhost:8090/graphql).

3. run `npm run test:coverage` to run tests that will fail if there isn't enough coverage.

4. run `npm run test:watch` to re-run the tests whenver a file changes.

### Unit tests
1. any file in `src/**/*.test.ts` run using mocha.

	see `npm run test:*`

### Project structure
```bash
src/
├── auth.ts // Passport authenticaion
├── graphql // graphql schemas
│   └── schema.gql // main schema
├── index.ts // graphql and server hookup
├── models // used for typeorm db connection
│   ├── index.ts // Data base connection
│   └── user.ts // User model
└── server.ts // server setup and config
```
## Deploying

1. run `npm run build`
2. run `npm start`