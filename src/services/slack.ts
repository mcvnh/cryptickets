import { Env } from './../types/env';
import { sha256 } from 'js-sha256';

export default {
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
  },

  async verifyMessage(env: Env, request: Request) {
    const signingSecret = '479722efe9c6e5ef700df820a71986e4';
    const body = await request.text();
    const timestamp = parseInt(request.headers.get('X-Slack-Request-Timestamp') ?? "0", 10);
    const slackSignature = request.headers.get('x-slack-signature');

    const isMoreThanFiveMinutes = Math.abs(Date.now() - timestamp) > (60 * 5);

    if (isMoreThanFiveMinutes) {
      return false;
    }

    const message = `v0:${timestamp}:${body}`;
    const verifySignature = `v0=${sha256.hmac(signingSecret, message)}`;

    return {
      verified: slackSignature == verifySignature,
      slackSignature,
      verifySignature
    }
  }
}