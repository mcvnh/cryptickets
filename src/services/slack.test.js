import { it, expect, vi, describe} from 'vitest';
import SLACK from './slack';

global.fetch = vi.fn();

const createFakeResponse = (fakeResponse) => {
  return { json: () => new Promise((resolve) => resolve(fakeResponse)) }
}

describe("Slack service", () => {
  it('can push a message to a slack channel', async () => {
    const response = {
      ok: true
    }

    fetch.mockResolvedValue(createFakeResponse(response));

    const repsonse = await SLACK.sendMessage({SLACK_XOXB_TOKEN: '123456'}, 'test_channel', 'sample message')

    expect(fetch).toHaveBeenCalledWith(
      'https://slack.com/api/chat.postMessage',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 123456`,
          'Content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          channel: 'test_channel',
          text: 'sample message'
        })
      }
    )

    expect(repsonse).toEqual(true);
  });

  it('can push a message to a slack channel but response was failed', async () => {
    const response = {
      ok: false,
      error: "too_many_attachments"
    }

    fetch.mockResolvedValue(createFakeResponse(response));

    const future = SLACK.sendMessage({SLACK_XOXB_TOKEN: '123456'}, 'test_channel', 'sample message');
    await expect(async () => await future).rejects.toThrowError('too_many_attachments');

    expect(fetch).toHaveBeenCalledWith(
      'https://slack.com/api/chat.postMessage',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 123456`,
          'Content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          channel: 'test_channel',
          text: 'sample message'
        })
      }
    )
  });
})