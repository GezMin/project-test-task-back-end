import { fetchProxy } from './fetchProxy';

describe('fetchProxy', () => {
  it('should fetch data through proxy successfully', async () => {
    const url = 'http://worldclockapi.com/api/json/utc/now';
    try {
      const data = await fetchProxy(url);
      expect(data).toBeDefined();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  });
});
