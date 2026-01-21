import type { RequestConfig } from './types'

const config: RequestConfig = {
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 0, //Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Auth_code:
      'Bearer eyJhbGciOiJIUzI1NiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJSqo5RystMzvZLzE2NUbKKUUpMyc3Mi1HSiVEqSc1LzCvxTAELG-AHhmAdpcWpRUSrr1WqBQAxpB-LhAAAAA.DnxoM-SP42cxKQ1itzQWvllyp4wUMtPg4rimovGUfYI',
  },
  showLoading: true,
  showError: true,
}

export default config
