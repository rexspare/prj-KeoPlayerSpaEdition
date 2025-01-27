import {appStateSelectors, useApp} from '../states/app';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

export const BASE_URL = "BASE_URL";

const useApi = () => {
  const accessToken = useApp(appStateSelectors.accessToken);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  };

  const apiInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15 * 1000, // 15 sec
    ...config,
  });

  const get = <R>(
    url: string,
    configs?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R & {Response: any}>> => {
    return apiInstance.get(url, configs!).catch(err => {
      return err;
    });
  };

  const put = <R>(
    url: string,
    params?: Record<string, string | number | boolean | object | undefined>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R & {Response: any}>> => {
    return apiInstance.put(url, params, config).catch(err => {
      return err;
    });
  };
  const del = <R>(
    url: string,
    // params?: Record<string, string | number | boolean | object | undefined>,
  ): Promise<AxiosResponse<R & {Response: any}>> => {
    return apiInstance.delete(url).catch(err => {
      return err;
    });
  };
  const post = async <R = any>(
    url: string,
    params?: Record<string, string | number | boolean | object | undefined>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R & {Response: any}>> => {
    try {
      const response = await apiInstance.post(url, params, config);
      return response;
    } catch (error: any) {
      // console.log(" === post error",error.response)
      return error as any;
    }
  };

  const toQueryParams = (params: Record<string, string | number | boolean>) => {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  };

  const toFormDataArray = (
    params: Record<string, string | number | boolean>,
  ) => {
    return Object.entries(params).map(([name, data]) => ({
      name,
      data: `${data}`,
    }));
  };

  return {get, post, put, del, toQueryParams, toFormDataArray};
};

export default useApi;
