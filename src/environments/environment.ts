import { version, versionTitle } from "./version";

export const environment = {
  production: false,
  apiPath: "http://192.168.1.99:16099", // local dev
  useMockData: false,
  version: version,
  versionTitle: versionTitle
};