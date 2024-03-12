import qs from 'qs';

export interface SlackMessage {
  token: string;
  teamId: string;
  teamDomain: string;
  enterpriseId: string;
  enterpriseName: string;
  channelId: string;
  channelName: string;
  userId: string;
  userName: string;
  command: string;
  text: string;
  responseUrl: string;
  triggerId: string;
  apiAppId: string;
}

export const getSlackMessage = async (request: Request): Promise<SlackMessage> => {
  const body = await request.text();
  const params = qs.parse(body);

  return {
    token: (params['token'] as string).trim(),
    teamId: (params['team_id'] as string).trim(),
    teamDomain: (params['team_domain'] as string).trim(),
    enterpriseId: (params['enterprise_id'] as string).trim(),
    enterpriseName: (params['enterprise_name'] as string).trim(),
    channelId: (params['channel_id'] as string).trim(),
    channelName: (params['channel_name'] as string).trim(),
    userId: (params['user_id'] as string).trim(),
    userName: (params['user_name'] as string).trim(),
    command: (params['command'] as string).trim(),
    text: (params['text'] as string).trim(),
    responseUrl: (params['response_url'] as string).trim(),
    triggerId: (params['trigger_id'] as string).trim(),
    apiAppId: (params['api_app_id'] as string).trim(),
  }
}