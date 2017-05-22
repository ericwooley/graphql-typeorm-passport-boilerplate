import startServer from './app'
import { join } from 'path'
import * as chalk from 'chalk'
require('dotenv').config({ path: join(__dirname, '../.enviornment') })

const isDev = process.env.NODE_ENV === 'dev'
const isTest = process.env.NODE_ENV === 'test'
const env = (isDev && 'development') || (isTest && 'test') || 'production'

async function bootstrap() {
  const app = await startServer({ isDev, isTest });
  const port: number = process.env.PORT || 4000;

  console.log('starting server...');

  console.log(chalk.blue(`Starting ${env} server on port ${port}: http://localhost:${port}`))

  app.listen(port, (error: Error) => {
    if (error) {
      console.error(chalk.red('could not start server'))
      console.error(chalk.red(error.message))
    } else {
      console.log(chalk.blue(`Server started, http://localhost:${port}/graphql`))
    }
  });
}

bootstrap();
