export interface Shoe {
  id: string;
  name: string;
  brand: string;
  type: 'Running' | 'Lifestyle' | 'Basketball' | 'Skate';
  price: number;
  imageUrl: string;
  gallery?: string[];
  description?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  matchPercentage?: number;
  reason?: string;
  isNew?: boolean;
}

export const storeShoes: Shoe[] = [
  { 
    id: '1', 
    name: 'Air Max Retro', 
    brand: 'Nike', 
    type: 'Lifestyle',
    price: 120, 
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Un icono que nunca pasa de moda. Las Air Max Retro combinan la amortiguación clásica con un diseño atrevido que destaca en cualquier calle. Perfectas para el uso diario con una comodidad inigualable.',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Rojo Fuego', hex: '#ef4444' },
      { name: 'Negro Obsidiana', hex: '#111827' },
      { name: 'Blanco Puro', hex: '#ffffff' }
    ],
    isNew: true
  },
  { 
    id: '2', 
    name: 'Classic Canvas', 
    brand: 'Vans', 
    type: 'Skate',
    price: 65, 
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'La esencia del skate en un diseño atemporal. Lona resistente, suela de gofre y un estilo que ha definido generaciones. Ideales tanto para la tabla como para un look casual relajado.',
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    colors: [
      { name: 'Negro/Blanco', hex: '#000000' },
      { name: 'Azul Navy', hex: '#1e3a8a' }
    ]
  },
  { 
    id: '3', 
    name: 'Urban Runner', 
    brand: 'Adidas', 
    type: 'Running',
    price: 140, 
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Tecnología de retorno de energía para tus carreras urbanas. Ligereza extrema y un ajuste tipo calcetín que se adapta a cada movimiento de tu pie.',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'Gris Espacial', hex: '#6b7280' },
      { name: 'Verde Neón', hex: '#84cc16' }
    ],
    isNew: true
  },
  { 
    id: '4', 
    name: 'Street High-Top', 
    brand: 'Jordan', 
    type: 'Basketball',
    price: 180, 
    imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Domina la cancha y la calle. Inspiradas en el legado del más grande, estas zapatillas ofrecen soporte premium y un estilo que impone respeto.',
    sizes: ['41', '42', '43', '44', '45', '46'],
    colors: [
      { name: 'Bred', hex: '#991b1b' },
      { name: 'Royal', hex: '#1e40af' }
    ]
  },
  { 
    id: '5', 
    name: 'Cloud Walker', 
    brand: 'On', 
    type: 'Running',
    price: 160, 
    imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Corre sobre nubes. La amortiguación CloudTec® transforma la energía del impacto en un impulso explosivo hacia adelante.',
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Arena', hex: '#d1d5db' },
      { name: 'Cielo', hex: '#60a5fa' }
    ],
    isNew: true
  },
  { 
    id: '6', 
    name: 'Retro Sport', 
    brand: 'Reebok', 
    type: 'Lifestyle',
    price: 90, 
    imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Vuelve a los 80 con un estilo renovado. Cuero suave y una silueta clásica que combina con todo tu armario.',
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: [
      { name: 'Blanco Vintage', hex: '#f3f4f6' },
      { name: 'Azul Retro', hex: '#3b82f6' }
    ]
  },
  { 
    id: '7', 
    name: 'SB Dunk Low', 
    brand: 'Nike', 
    type: 'Skate',
    price: 110, 
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'La zapatilla de skate más deseada del mundo. Colores vibrantes y una construcción robusta para aguantar cualquier truco.',
    sizes: ['37', '38', '39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Multicolor', hex: '#f59e0b' },
      { name: 'Panda', hex: '#000000' }
    ],
    isNew: true
  },
  { 
    id: '8', 
    name: 'Harden Vol. 7', 
    brand: 'Adidas', 
    type: 'Basketball',
    price: 160, 
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Diseñadas para el juego creativo. Estabilidad lateral y una amortiguación que te permite cambiar de dirección en un abrir y cerrar de ojos.',
    sizes: ['42', '43', '44', '45', '46', '47'],
    colors: [
      { name: 'Plata Metálico', hex: '#9ca3af' },
      { name: 'Naranja Fuego', hex: '#f97316' }
    ]
  },
  {
    id: 'nike-dn-2024-black-pink',
    name: 'Nike Air Max Dn "Real Pink"',
    brand: 'Nike',
    type: 'Lifestyle',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop'],
    description: 'La próxima generación de tecnología Air. Las Air Max Dn cuentan con nuestro sistema de tubos Dynamic Air de doble presión, creando una sensación reactiva en cada paso. Colorway negro con cápsulas rosa brillante.',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: [{ name: 'Rosa Real', hex: '#ec4899' }, { name: 'Negro', hex: '#000000' }],
    isNew: true
  },
  {
    id: 'nike-shox-tl-black',
    name: 'Nike Shox TL "Triple Black"',
    brand: 'Nike',
    type: 'Lifestyle',
    price: 98,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop'],
    description: 'La amortiguación mecánica llevada a su máximo nivel. Las Nike Shox TL traen de vuelta el icono de 2003 con columnas de amortiguación flexibles en toda la suela y un acabado triple negro premium.',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'Negro', hex: '#000000' }]
  },
  {
    id: 'puma-mb03-toxic',
    name: 'Puma LaMelo Ball MB.03 "Toxic"',
    brand: 'Puma',
    type: 'Basketball',
    price: 112,
    imageUrl: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800&auto=format&fit=crop'],
    description: 'La silueta de LaMelo Ball en un diseño psicodélico y fluorescente. Tecnología de espuma NITRO para máxima respuesta en la cancha y un agarre antideslizante sin igual.',
    sizes: ['41', '42', '43', '44', '45'],
    colors: [{ name: 'Púrpura', hex: '#a855f7' }, { name: 'Rosa', hex: '#ec4899' }, { name: 'Verde', hex: '#22c55e' }],
    isNew: true
  },
  {
    id: 'adidas-forum-mid-blue',
    name: 'Adidas Forum Mid "University Blue"',
    brand: 'Adidas',
    type: 'Lifestyle',
    price: 98,
    imageUrl: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=800&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=800&auto=format&fit=crop'],
    description: 'El clásico de baloncesto de 1984 regresa con su emblemática correa ajustable de tobillo y cuero blanco premium con detalles en azul universitario.',
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: [{ name: 'Blanco', hex: '#ffffff' }, { name: 'Azul', hex: '#3b82f6' }]
  },
  {
    id: 'nb-9060-sea-salt',
    name: 'New Balance 9060 "Sea Salt Brown"',
    brand: 'New Balance',
    type: 'Lifestyle',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop'],
    description: 'La silueta retro-futurista más codiciada. Las New Balance 9060 combinan elementos de los modelos clásicos de la serie 990 con una suela ondulada exagerada y amortiguación ABZORB.',
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'Hueso', hex: '#f3f4f6' }, { name: 'Marrón', hex: '#78350f' }],
    isNew: true
  },
  {
    id: 'jordan-retro-4-pine-green',
    name: 'Jordan Retro 4 SB "Pine Green"',
    brand: 'Jordan',
    type: 'Basketball',
    price: 98,
    imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop'],
    description: 'La aclamada colaboración de Nike SB y Jordan Brand. Reestructurada para el skate con plástico más suave, una lengüeta más acolchada y la increíble amortiguación de talón con el colorway Pine Green.',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'Blanco', hex: '#ffffff' }, { name: 'Verde Pino', hex: '#15803d' }],
    isNew: true
  },
  {
    id: 'jordan-retro-3-jbalvin',
    name: 'Air Jordan Retro 3 x J Balvin "Sunset"',
    brand: 'Jordan',
    type: 'Basketball',
    price: 98,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop'],
    description: 'Diseñadas en colaboración con el icono colombiano J Balvin. Cuenta con un cuero premium color sail y una entresuela trasera que muestra un hermoso degradado de puesta de sol de Medellín.',
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    colors: [{ name: 'Hueso', hex: '#fafaf9' }, { name: 'Sunset Gradient', hex: '#f43f5e' }]
  }
];
