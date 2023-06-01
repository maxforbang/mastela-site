import { getBaseUrl } from "../api";

export const fetchProperties = async () => {
  const res = await fetch(`${getBaseUrl()}/api/getProperties`)

  const {properties} = await res.json();

  return properties;
}