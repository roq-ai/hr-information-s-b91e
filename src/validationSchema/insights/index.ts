import * as yup from 'yup';

export const insightValidationSchema = yup.object().shape({
  trending_topics: yup.string().required(),
  audience_engagement: yup.string().required(),
  influencer_metrics: yup.string().required(),
  user_id: yup.string().nullable(),
});
