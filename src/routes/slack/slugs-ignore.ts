import { Env } from "../../types/env";
import qs from 'qs';
import KV from '../../services/kv';
import SLACK from '../../services/slack';

export const SlugsIgnoreAdd = async (request: Request, env: Env) => {
  const body = await request.text();
  const params = qs.parse(body);
  const channel = (params['channel_id'] as string).trim();
  const slugs = (params['text'] as string).trim().replaceAll(" ", ",").split(',');

  try {
    for await (let slug of slugs) {
      await KV.push(env, channel, slug);
    }

    await SLACK.sendMessage(env, channel, `Added ${slugs.join(', ')}`);
    return new Response();
  } catch (error: any) {
    return new Response(error.message);
  }
}

export const SlugsIgnoreList = async (request: Request, env: Env) => {
  const body = await request.text();
  const params = qs.parse(body);
  const channel = (params['channel_id'] as string).trim();

  try {
    const ignores = await KV.get(env, channel);
    await SLACK.sendMessage(env, channel, ignores.map(it => it.slug).join(', '));
    return new Response();
  } catch (error: any) {
    return new Response(error.message);
  }
}

export const SlugsIgnoreRemove = async (request: Request, env: Env) => {
  const body = await request.text();
  const params = qs.parse(body);
  const channel = (params['channel_id'] as string).trim();
  const slugs = (params['text'] as string).trim().replaceAll(" ", ",").split(',');

  try {
    for await (let slug of slugs) {
      await KV.remove(env, channel, slug);
    }

    await SLACK.sendMessage(env, channel, `Removed ${slugs.join(', ')}`);
    return new Response();
  } catch (error: any) {
    return new Response(error.message);
  }
}