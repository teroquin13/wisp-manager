/**
 * MikroTik RouterOS v7 REST API Client
 */
export class MikrotikApi {
  private baseUrl: string;
  private authHeader: string;

  constructor(ipAddress: string, user: string, pass: string, port = 443, useSsl = true) {
    const protocol = useSsl ? 'https' : 'http';
    this.baseUrl = `${protocol}://${ipAddress}:${port}/rest`;
    this.authHeader = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
  }

  private async request(endpoint: string, method: string = 'GET', body?: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Mikrotik API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getSystemResource() {
    return this.request('/system/resource');
  }

  async getInterfaces() {
    return this.request('/interface');
  }

  async addSimpleQueue(name: string, target: string, maxLimit: string) {
    return this.request('/queue/simple', 'PUT', {
      name,
      target,
      'max-limit': maxLimit // ej: '10M/10M'
    });
  }

  async removeSimpleQueue(id: string) {
    return this.request(`/queue/simple/${id}`, 'DELETE');
  }
}
