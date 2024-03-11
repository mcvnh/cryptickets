import { Env } from './../types/env';
export default {
  async sendMessage(env: Env, channel: string, text: string) {
    try {
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

      if (response.ok) {
        return { status: 'success' }
      }

      return { status: 'failed', message: response.error }
    } catch (error) {
      return { status: 'failed', message: 'slack http error' }
    }
  }
}