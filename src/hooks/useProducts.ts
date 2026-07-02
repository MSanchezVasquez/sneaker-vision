import { useState, useEffect } from 'react';
import { Shoe } from '../lib/data';
import { productService } from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState<Shoe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
}
