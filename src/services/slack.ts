import { Env } from './../types/env';
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
  }
}