import axios from 'axios';
import queryString from 'query-string';
import { InsightInterface, InsightGetQueryInterface } from 'interfaces/insight';
import { GetQueryInterface } from '../../interfaces';

export const getInsights = async (query?: InsightGetQueryInterface) => {
  const response = await axios.get(`/api/insights${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createInsight = async (insight: InsightInterface) => {
  const response = await axios.post('/api/insights', insight);
  return response.data;
};

export const updateInsightById = async (id: string, insight: InsightInterface) => {
  const response = await axios.put(`/api/insights/${id}`, insight);
  return response.data;
};

export const getInsightById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/insights/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteInsightById = async (id: string) => {
  const response = await axios.delete(`/api/insights/${id}`);
  return response.data;
};
