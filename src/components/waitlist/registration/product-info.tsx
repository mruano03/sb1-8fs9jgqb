import { motion } from 'framer-motion';
import { Tag, Clock, Star, Box } from 'lucide-react';
import type { WaitlistProduct } from '@/lib/types';

interface ProductInfoProps {
  product: WaitlistProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 rounded-lg bg-white shadow-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=128"
            alt="Brand Logo"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          {product.pricing && (
            <p className="text-blue-600 font-semibold">
              Starting at ${product.pricing.amount}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-lg text-gray-600 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Box className="h-4 w-4 mr-1" />
            Limited Edition
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Early Access
          </div>
          <div className="flex items-center text-blue-600">
            <Tag className="h-4 w-4 mr-1" />
            Exclusive Price
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">What You Get</h3>
        <ul className="space-y-3">
          {product.benefits.map((benefit, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center text-gray-600"
            >
              <Star className="h-4 w-4 mr-2 text-blue-500" />
              {benefit}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}