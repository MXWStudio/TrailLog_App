export interface Trail {
  id: number;
  name: string;
  location: string;
  rating: number;
  difficulty: '简单' | '中等' | '困难';
  distance: number; // in km
  estimatedTime: string; // e.g., "3h 9m"
  imageUrl: string;
  mapPreviewUrl: string;
}

export const trails: Trail[] = [
  {
    id: 1,
    name: '青城山徒步',
    location: '都江堰, 四川, 中国',
    rating: 4.3,
    difficulty: '困难',
    distance: 7.24,
    estimatedTime: '3h 9m',
    imageUrl: 'https://i.pinimg.com/originals/2e/2d/2e2d2e2d2e2d2e2d2e2d2e2d2e2d2e2d.jpg', // 青城山/四川山景
    mapPreviewUrl: '', // Or null. This will trigger the placeholder in TrailCard.vue
  },
  {
    id: 2,
    name: '富士山吉田路线',
    location: '山梨县, 日本',
    rating: 4.8,
    difficulty: '困难',
    distance: 14.5,
    estimatedTime: '8h 30m',
    imageUrl: 'https://i.pinimg.com/originals/3a/3b/3a3b3a3b3a3b3a3b3a3b3a3b3a3b3a3b.jpg', // 富士山
    mapPreviewUrl: '', // Or null
  },
  {
    id: 3,
    name: '龙脊梯田徒步',
    location: '桂林, 广西, 中国',
    rating: 4.6,
    difficulty: '中等',
    distance: 10.1,
    estimatedTime: '4h 15m',
    imageUrl: 'https://i.pinimg.com/originals/4c/4d/4c4d4c4d4c4d4c4d4c4d4c4d4c4d4c4d.jpg', // 龙脊梯田
    mapPreviewUrl: '', // Or null
  },
];