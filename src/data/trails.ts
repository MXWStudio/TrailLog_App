export interface Trail {
  id: string;
  name: string;
  location: string;
  rating: number;
  difficulty: string;
  distance: number; // in km
  estimatedTime: string; // e.g., "3h 9m"
  imageUrl?: string;
  mapPreviewUrl?: string;
  coordinates?: [number, number][]; // 添加坐标数组，格式为 [[经度, 纬度], ...]
  description?: string;
}

export const trails: Trail[] = [
  {
    id: '1',
    name: '青城山后山幽径',
    location: '都江堰, 四川, 中国',
    rating: 4.3,
    difficulty: '中等',
    distance: 7.24,
    estimatedTime: '3h 9m',
    imageUrl: '/src/assets/qingcheng_mountain.jpg',
    mapPreviewUrl: '/src/assets/qingcheng_mountain.jpg',
    coordinates: [[103.5667, 30.9000]], // 青城山大致坐标
    description: '穿行于古老森林中的石阶小径，两旁绿意盎然，幽静清新。这条后山步道让您远离喧嚣，感受道教名山的静谧之美。'
  },
  {
    id: '2',
    name: '富士山吉田路线',
    location: '山梨县, 日本',
    rating: 4.8,
    difficulty: '困难',
    distance: 14.5,
    estimatedTime: '8h 30m',
    imageUrl: '/src/assets/fushi_mountain.jpg',
    mapPreviewUrl: '/src/assets/fushi_mountain.jpg',
    coordinates: [[138.7274, 35.3606]], // 富士山坐标
    description: '日本最高峰富士山的经典登山路线，沿途可欣赏壮丽的火山地貌和云海美景。这是一次挑战自我、亲近自然的绝佳体验。'
  },
  {
    id: '3',
    name: '龙脊梯田徒步',
    location: '桂林, 广西, 中国',
    rating: 4.6,
    difficulty: '中等',
    distance: 10.1,
    estimatedTime: '4h 15m',
    imageUrl: '/src/assets/longjititian.jpg',
    mapPreviewUrl: '/src/assets/longjititian.jpg',
    coordinates: [[109.9618, 25.3732]], // 龙脊梯田坐标
    description: '穿越千年梯田的徒步之旅，层层叠叠的稻田如诗如画。春天看水满田畴，秋天赏金浪翻滚，感受壮族文化的深厚底蕴。'
  },
];