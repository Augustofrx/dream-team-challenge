import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Team {
  id: number;
  name: string;
  teamSide: string;
}

const fetchTeams = async (): Promise<Team[]> => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    try {
      const response = await axios.get<Team[]>(`${API_BASE_URL}/teams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedTeams = response.data.sort((a, b) => {
        if (a.teamSide === b.teamSide) {
          return a.id - b.id;
        }
        return a.teamSide === 'left' ? -1 : 1;
      });

      return sortedTeams;
    } catch (error) {
      console.error("Error fetching teams:", error);
      return [];
    }
  } else {
    return []; 
  }
};

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });
};
