import { createClient } from 'next-sanity'
import { env } from "~/env.mjs";

const apiVersion = '2023-05-30';
const dataset = "production";
const projectId = "n9q65f5k";
const useCdn = false;

export default createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
})
