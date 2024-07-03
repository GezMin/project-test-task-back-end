import axios from 'axios';

interface ProxyConfig {
  host: string;
  port: number;
  auth: {
    username: string;
    password: string;
  };
}

export async function fetchProxy(url: string): Promise<any> {
  const proxy: ProxyConfig = {
    host: '45.196.48.9',
    port: 5435,
    auth: {
      username: 'jtzhwqur',
      password: 'jnf0t0n2tecg',
    },
  };

  try {
    const response = await axios.get(url, { proxy });
    return response.data;
  } catch (error) {
    throw error;
  }
}
