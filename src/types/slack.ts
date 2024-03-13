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