import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface InsightInterface {
  id?: string;
  trending_topics: string;
  audience_engagement: string;
  influencer_metrics: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface InsightGetQueryInterface extends GetQueryInterface {
  id?: string;
  trending_topics?: string;
  audience_engagement?: string;
  influencer_metrics?: string;
  user_id?: string;
}
