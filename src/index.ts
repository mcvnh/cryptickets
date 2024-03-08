import { Env } from './types/env';

import { Router } from 'itty-router';
import Hello from './routes/hello';
import NotFound from './routes/404';
import SlackPrices from './routes/slack/Prices';

const router = Router();
router.post("/slack/prices", SlackPrices);
router.get("/", Hello);
router.get("*", NotFound);


export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<any> {

    return router.handle(request, env, ctx);
  }
};
