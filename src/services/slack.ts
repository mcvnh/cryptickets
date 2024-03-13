import { SlackMessage } from '../types/slack';
import { Env } from './../types/env';
import { sha256 } from 'js-sha256';
import qs from 'qs';

export default {
  async getSlackMessage(env: Env, request: Request): Promise<SlackMessage> {
    const body = await request.text();

    const verified = await this.verifyMessage(env, request, body);
    if (!verified) {
      throw new Error('invalid signature');
    }

    const params = qs.parse(body);

    return {
      token: (params['token'] as string ?? "").trim(),
      teamId: (params['team_id'] as string ?? "").trim(),
      teamDomain: (params['team_domain'] as string ?? "").trim(),
      enterpriseId: (params['enterprise_id'] as string ?? "").trim(),
      enterpriseName: (params['enterprise_name'] as string ?? "").trim(),
      channelId: (params['channel_id'] as string ?? "").trim(),
      channelName: (params['channel_name'] as string ?? "").trim(),
      userId: (params['user_id'] as string ?? "").trim(),
      userName: (params['user_name'] as string ?? "").trim(),
      command: (params['command'] as string ?? "").trim(),
      text: (params['text'] as string ?? "").trim(),
      responseUrl: (params['response_url'] as string ?? "").trim(),
      triggerId: (params['trigger_id'] as string ?? "").trim(),
      apiAppId: (params['api_app_id'] as string ?? "").trim(),
    }
  },

  async verifyMessage(env: Env, request: Request, body: string) {
    const timestamp = parseInt(request.headers.get('X-Slack-Request-Timestamp') ?? "0", 10);
    const slackSignature = request.headers.get('x-slack-signature');
    const now = Math.round(Date.now() / 1000);

    const isMoreThanFiveMinutes = Math.abs(now - timestamp) > (60 * 5);

    if (isMoreThanFiveMinutes) {
      return {
        verified: false,
        slackSignature,
        verifySignature: null,
        now,
        timestamp,
      };
    }

    const message = `v0:${timestamp}:${body}`;
    const verifySignature = `v0=${sha256.hmac(env.SLACK_SIGNING_SECRET, message)}`;

    return {
      verified: slackSignature == verifySignature,
      slackSignature,
      verifySignature,
      now,
      timestamp
    }
  },

  async sendMessage(env: Env, channel: string, text: string) {
    const response: any = await fetch(`https://slack.com/api/chat.postMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.SLACK_XOXB_TOKEN}`,
        'Content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        channel,
        text
      })
    })
    .then(response => response.json())

    if (!response.ok) {
      throw new Error(response.error)
    }

    return true;
  }
}