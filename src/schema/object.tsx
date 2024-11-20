import {defineField, defineType} from 'sanity'
import {ImagePreview} from '../component/CustomImagePreview'

export default defineType({
  name: 'customImageObject',
  type: 'object',
  title: 'Custom Image Object',
  fields: [
    defineField({
      name: 'image',
      type: 'reference',
      to: [{type: 'customImage'}],
      title: 'Image Reference',
    }),
    defineField({
      name: 'crop',
      type: 'object',
      title: 'Crop Information',
      fields: [
        defineField({name: 'top', type: 'number', title: 'Top'}),
        defineField({name: 'height', type: 'number', title: 'Height'}),
        defineField({name: 'left', type: 'number', title: 'Left'}),
        defineField({name: 'width', type: 'number', title: 'Width'}),
      ],
      options: {
        collapsible: true, // Makes the crop section collapsible in the UI
        collapsed: true,
      },
    }),
    defineField({
      name: 'metaOverwrite',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
        }),
      ],
    }),
  ],
  components: {
    field: ImagePreview,
  },
  preview: {
    select: {
      title: 'image.title',
      media: 'image.imageUrl',
    },
    prepare({title, media}) {
      return {
        title: title || 'Untitled Image',
        media: media ? (
          <img src={media} alt={title || 'Preview Image'} style={{maxWidth: '100%'}} />
        ) : null,
      }
    },
  },
})
