import { Env } from './types/env';

import { Router } from 'itty-router';
import Hello from './routes/hello';
import NotFound from './routes/404';
import SlackPrices from './routes/slack/prices';
import { SlugsIgnoreAdd, SlugsIgnoreList, SlugsIgnoreRemove } from './routes/slack/slugs-ignore';

const router = Router();
router.post("/slack/prices", SlackPrices);
router.post("/slack/ignores-add", SlugsIgnoreAdd);
router.post("/slack/ignores-list", SlugsIgnoreList);
router.post("/slack/ignores-remove", SlugsIgnoreRemove);
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
