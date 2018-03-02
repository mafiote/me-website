import { version, versionTitle } from "./version";

export const environment = {
  production: true,
  apiPath: "http://99.99.99.99:99", // its blank for dynamic call
  useMockData: false,
  version: version,
  versionTitle: versionTitle
};
