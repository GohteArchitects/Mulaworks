import { Extension } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import ImageLayoutComponent from '../app/components/ImageLayoutComponent';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageLayout: {
      setImageLayout: (options: { src: string; layout: string }) => ReturnType;
    };
  }
}

export const ImageLayoutExtension = Image.extend({
  name: 'imageLayout',
  addAttributes() {
    return {
      ...this.parent?.(),
      layout: {
        default: 'default',
        parseHTML: element => element.getAttribute('data-layout') || 'default',
        renderHTML: attributes => {
          if (!attributes.layout) {
            return {};
          }
          return {
            'data-layout': attributes.layout,
          };
        },
      },
    };
  },
  addCommands() {
    return {
      setImageLayout: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageLayoutComponent);
  },
});