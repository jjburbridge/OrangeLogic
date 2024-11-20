import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'customImage',
  type: 'document',
  title: 'Custom Image',
  readOnly: true,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'imageUrl',
      type: 'url',
      title: 'Image URL',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }).required(),
    }),
    // add any additional fields you want to always bring in and store against an asset
  ],
  preview: {
    select: {
      title: 'title',
      media: 'imageUrl',
    },
    prepare({title, media}) {
      return {
        title: title || 'Untitled Image',
        media: media ? <img src={media} alt={title || 'Preview Image'} /> : null,
      }
    },
  },
})
