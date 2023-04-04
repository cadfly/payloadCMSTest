import type { CollectionConfig } from 'payload/types'

import { fetchDiscordThreads } from '../scripts/fetch-discord'
import { fetchGithubDiscussions } from '../scripts/fetch-github'

export const CommunityHelp: CollectionConfig = {
  slug: 'community-help',
  admin: {
    useAsTitle: 'title',
  },
  labels: {
    singular: 'Community Help',
    plural: 'Community Helps',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'communityHelpType',
      label: 'Community Help Type',
      type: 'radio',
      access: {
        update: () => false,
      },
      options: [
        {
          label: 'Discord Thread',
          value: 'discord',
        },
        {
          label: 'GitHub Discussion',
          value: 'github',
        },
      ],
    },
    {
      name: 'githubID',
      label: 'GitHub ID',
      type: 'text',
      index: true,
      admin: {
        condition: (_, siblingData) => siblingData?.communityHelpType === 'github',
      },
    },
    {
      name: 'discordID',
      label: 'Discord ID',
      type: 'text',
      index: true,
      admin: {
        condition: (_, siblingData) => siblingData?.communityHelpType === 'discord',
      },
    },
    {
      name: 'communityHelpJSON',
      type: 'json',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  endpoints: [
    {
      path: '/cron',
      method: 'get',
      handler: async (req, res) => {
        if (process.env.NEXT_PRIVATE_CRON_KEY === req.query.key) {
          fetchDiscordThreads(req.payload)
          fetchGithubDiscussions(req.payload)
        }
        return res.json({ message: 'success' })
      },
    },
  ],
}