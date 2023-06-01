import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '../env'

export default createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
})
