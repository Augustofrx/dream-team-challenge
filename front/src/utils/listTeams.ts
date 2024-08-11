import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchTeams = async () => {
  const response = await axios.get(`${API_BASE_URL}/teams`);
  return response.data;
};
