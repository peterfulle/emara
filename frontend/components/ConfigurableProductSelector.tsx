'use client';

import { useCart } from '@/lib/cart/CartContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Variant {
  attributes: Array<{
    code: string;
    value_index: number;
    label: string;
  }>;
  product: {
    id: string;
    name: string;
    sku: string;
    price_range: {
      minimum_price: {
        final_price: {
          value: number;
          currency: string;
        };
      };
    };
    image?: {
      url: string;
    };
    media_gallery?: Array<{
      url: string;
    }>;
  };
}

interface ConfigurableOption {
  attribute_code: string;
  label: string;
  values: Array<{
    value_index: number;
    label: string;
  }>;
}

interface ConfigurableProductSelectorProps {
  product: {
    id: string;
    name: string;
    sku: string;
    variants: Variant[];
    configurable_options: ConfigurableOption[];
    image?: {
      url: string;
    };
  };
  onVariantChange?: (variantImage: string | undefined) => void;
}

export default function ConfigurableProductSelector({ product, onVariantChange }: ConfigurableProductSelectorProps) {
  const { addItem } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | undefined>(product.image?.url);

  // Encontrar la variante seleccionada
  const selectedVariant = product.variants.find((variant) => {
    return variant.attributes.every((attr) => {
      return selectedOptions[attr.code] === attr.value_index;
    });
  });

  // Actualizar imagen cuando cambia la variante seleccionada
  useEffect(() => {
    if (selectedVariant?.product.image?.url) {
      setCurrentImage(selectedVariant.product.image.url);
      onVariantChange?.(selectedVariant.product.image.url);
    } else if (selectedVariant?.product.media_gallery?.[0]?.url) {
      setCurrentImage(selectedVariant.product.media_gallery[0].url);
      onVariantChange?.(selectedVariant.product.media_gallery[0].url);
    }
  }, [selectedVariant, onVariantChange]);

  const isComplete = product.configurable_options.every(
    (option) => selectedOptions[option.attribute_code] !== undefined
  );

  const handleOptionChange = (attributeCode: string, valueIndex: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeCode]: valueIndex,
    }));
  };

  const handleAddToCart = () => {
    if (!isComplete || !selectedVariant) return;

    setIsAdding(true);

    const sizeAttr = selectedVariant.attributes.find((a) => a.code === 'size');
    const colorAttr = selectedVariant.attributes.find((a) => a.code === 'color');

    addItem({
      id: selectedVariant.product.id,
      name: product.name,
      sku: selectedVariant.product.sku,
      price: selectedVariant.product.price_range.minimum_price.final_price.value,
      currency: selectedVariant.product.price_range.minimum_price.final_price.currency,
      image: selectedVariant.product.image?.url || product.image?.url,
      selectedSize: sizeAttr?.label,
      selectedColor: colorAttr?.label,
    });

    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }, 300);
  };

  // Obtener las opciones de tallas únicas
  const sizeOption = product.configurable_options.find((opt) => opt.attribute_code === 'size');
  const colorOption = product.configurable_options.find((opt) => opt.attribute_code === 'color');

  return (
    <div className="space-y-6">
      {/* Selector de Talla */}
      {sizeOption && (
        <div>
          <label className="block text-xs tracking-wider uppercase text-gray-700 mb-3">
            Talla
          </label>
          <div className="flex flex-wrap gap-2">
            {sizeOption.values.map((value) => (
              <button
                key={value.value_index}
                onClick={() => handleOptionChange('size', value.value_index)}
                className={`min-w-[3rem] px-4 py-3 text-sm border transition-colors ${
                  selectedOptions['size'] === value.value_index
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-black'
                }`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de Color */}
      {colorOption && (
        <div>
          <label className="block text-xs tracking-wider uppercase text-gray-700 mb-3">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOption.values.map((value) => (
              <button
                key={value.value_index}
                onClick={() => handleOptionChange('color', value.value_index)}
                className={`px-5 py-3 text-sm border transition-colors ${
                  selectedOptions['color'] === value.value_index
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-black'
                }`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Precio de la variante seleccionada */}
      {selectedVariant && (
        <div className="text-sm text-gray-600 font-light">
          Precio: ${selectedVariant.product.price_range.minimum_price.final_price.value.toFixed(0)}{' '}
          {selectedVariant.product.price_range.minimum_price.final_price.currency}
        </div>
      )}

      {/* Botón Agregar al Carrito */}
      <button
        onClick={handleAddToCart}
        disabled={!isComplete || isAdding}
        className={`w-full py-4 text-sm tracking-wider uppercase transition-all ${
          !isComplete
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : showSuccess
            ? 'bg-green-600 text-white'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isAdding ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Agregando...
          </span>
        ) : showSuccess ? (
          '✓ Agregado al carrito'
        ) : !isComplete ? (
          'Selecciona opciones'
        ) : (
          'Agregar al carrito'
        )}
      </button>

      <button className="w-full border border-black py-4 text-sm tracking-wider uppercase hover:bg-black hover:text-white transition-all duration-300">
        Agregar a favoritos
      </button>
    </div>
  );
}
