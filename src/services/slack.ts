import { Env } from './../types/env';
export default {
  async sendMessage(env: Env, channel: string, text: string) {
    try {
      const response = await fetch(`https://slack.com/api/chat.postMessage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.SLACK_XOXB_TOKEN}`,
          'Content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          channel,
          text
        })
      });

      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}