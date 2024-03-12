import { Env } from "../../types/env";
import IGNORES from '../../services/ignores';
import SLACK from '../../services/slack';
import { getSlackMessage } from "../../types/slack_request";

export const SlugsIgnoreAdd = async (request: Request, env: Env) => {
  const receivedMessage = await getSlackMessage(request);
  const channel = receivedMessage.channelId;
  const slugs = receivedMessage.text.replaceAll(" ", ",").split(',');

  try {
    for await (let slug of slugs) {
      await IGNORES.push(env, channel, slug);
    }

    await SLACK.sendMessage(env, channel, `Added ${slugs.join(', ')}`);
    return new Response();
  } catch (error: any) {
    return new Response(error.message);
  }
}

export const SlugsIgnoreList = async (request: Request, env: Env) => {
  const receivedMessage = await getSlackMessage(request);
  const channel = receivedMessage.channelId;

  try {
    const ignores = await IGNORES.get(env, channel);
    await SLACK.sendMessage(env, channel, ignores.map(it => it.slug).join(', '));
    return new Response();
  } catch (error: any) {
    return new Response(error.message);
  }
}

export const SlugsIgnoreRemove = async (request: Request, env: Env) => {
  const receivedMessage = await getSlackMessage(request);
  const channel = receivedMessage.channelId;
  const slugs = receivedMessage.text.replaceAll(" ", ",").split(',');

  try {
    for await (let slug of slugs) {
      await IGNORES.remove(env, channel, slug);
    }

    await SLACK.sendMessage(env, channel, `Removed ${slugs.join(', ')}`);
    return new Response();
  } catch (error: any) {
    return new Response(error.message);
  }
}

export const TestSlackVerify = async (request: Request, env: Env) => {
  const verify: boolean | object = await SLACK.verifyMessage(env, request);

  if (verify) {
    return Response.json(verify);
  }

  return new Response('timestamp check failed');
}