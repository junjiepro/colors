import axios from 'axios';
import { CreateToolDto, TestConnectionResult, Tool, UpdateToolDto } from '@/types';

const API_BASE_URL = '/api/tools';

export const toolsApi = {
  async getAll(): Promise<Tool[]> {
    const { data } = await axios.get<Tool[]>(API_BASE_URL);
    return data;
  },

  async getById(id: string): Promise<Tool> {
    const { data } = await axios.get<Tool>(`${API_BASE_URL}/${id}`);
    return data;
  },

  async create(tool: CreateToolDto): Promise<Tool> {
    const { data } = await axios.post<Tool>(API_BASE_URL, tool);
    return data;
  },

  async update(id: string, updates: UpdateToolDto): Promise<Tool> {
    const { data } = await axios.patch<Tool>(`${API_BASE_URL}/${id}`, updates);
    return data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  async testConnection(tool: CreateToolDto | UpdateToolDto): Promise<TestConnectionResult> {
    try {
      const { data } = await axios.post<TestConnectionResult>(
        `${API_BASE_URL}/test-connection`,
        tool
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as TestConnectionResult;
      }
      throw error;
    }
  },

  async connect(id: string): Promise<Tool> {
    const { data } = await axios.post<Tool>(`${API_BASE_URL}/${id}/connect`);
    return data;
  },

  async disconnect(id: string): Promise<Tool> {
    const { data } = await axios.post<Tool>(`${API_BASE_URL}/${id}/disconnect`);
    return data;
  },
};
