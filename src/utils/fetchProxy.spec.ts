import { fetchProxy } from './fetchProxy';

describe('fetchProxy', () => {
  it('should fetch data proxy ', async () => {
    const url = '45.196.48.9:5435';
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
