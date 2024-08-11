import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  id: string,
  email: string,
  name: string
}

export const createTeam = async (token:User ,name: string, reloadTeam: () => void) => {
  try {
console.log(token)
   await axios.post(`${API_BASE_URL}/teams`, {
      name,
      userId: token?.id
    });
    reloadTeam();
  } catch (error) {

    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data);
    }

  }
};
