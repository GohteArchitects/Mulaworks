import React from 'react';

const ImageLayoutComponent = (props: any) => {
  const { node, updateAttributes } = props;
  const { src, layout = 'default' } = node.attrs;

  const changeLayout = (newLayout: string) => {
    updateAttributes({ layout: newLayout });
  };

  const renderLayout = () => {
    switch (layout) {
      case 'full-width':
        return (
          <div className="w-full">
            <img src={src} className="w-full h-auto rounded-lg" alt="" />
          </div>
        );
      case 'left-text':
        return (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">
              <img src={src} className="w-full h-auto rounded-lg" alt="" />
            </div>
            <div className="md:w-1/3 bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-500 italic">Add your text here</p>
            </div>
          </div>
        );
      case 'right-text':
        return (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3 bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-500 italic">Add your text here</p>
            </div>
            <div className="md:w-2/3">
              <img src={src} className="w-full h-auto rounded-lg" alt="" />
            </div>
          </div>
        );
      case 'grid-2':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img src={src} className="w-full h-auto rounded-lg" alt="" />
            <img src={src} className="w-full h-auto rounded-lg" alt="" />
          </div>
        );
      case 'centered':
        return (
          <div className="flex justify-center">
            <div className="max-w-2xl">
              <img src={src} className="w-full h-auto rounded-lg" alt="" />
            </div>
          </div>
        );
      default:
        return <img src={src} className="w-full h-auto rounded-lg" alt="" />;
    }
  };

  return (
    <div className="relative group my-4">
      {renderLayout()}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded shadow flex flex-wrap gap-1">
        {['default', 'full-width', 'left-text', 'right-text', 'grid-2', 'centered'].map((layoutOption) => (
          <button
            key={layoutOption}
            onClick={() => changeLayout(layoutOption)}
            className={`px-2 py-1 text-xs ${
              layout === layoutOption ? 'bg-blue-100' : 'bg-gray-100'
            } rounded`}
          >
            {layoutOption.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageLayoutComponent;