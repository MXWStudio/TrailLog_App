export interface Author {
  name: string
  avatar: string
}

export interface Post {
  id: number
  title: string
  location: string
  imageUrl: string
  isRecap: boolean
  author: Author
  timeAgo: string
  distance: string
  duration: string
  elevation: string
  rating: number
  trailName: string
  commentCount: number
  date: string
}

export const mockPosts: Post[] = [
  {
    id: 1,
    title: "下午在青城山徒步",
    location: "成都",
    imageUrl: "/src/assets/Mount Qingcheng.jpg",
    isRecap: true,
    author: {
      name: "Bob Duan",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    timeAgo: "2小时前",
    distance: "7.57 km",
    duration: "4h 31m",
    elevation: "614 m",
    rating: 4,
    trailName: "青城山徒步路线",
    commentCount: 1,
    date: "Jun 1"
  },
  {
    id: 2,
    title: "探索莫干山竹林小径",
    location: "浙江省湖州市德清县",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    isRecap: true,
    author: {
      name: "山野行者",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    timeAgo: "2小时前",
    distance: "8.5 km",
    duration: "3小时",
    elevation: "320 m",
    rating: 5,
    trailName: "莫干山竹林小径",
    commentCount: 3,
    date: "May 30"
  },
  {
    id: 3,
    title: "黄山日出徒步之旅",
    location: "安徽省黄山市",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    isRecap: false,
    author: {
      name: "云海漫步",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    },
    timeAgo: "5小时前",
    distance: "12.3 km",
    duration: "5小时",
    elevation: "856 m",
    rating: 5,
    trailName: "黄山光明顶路线",
    commentCount: 7,
    date: "May 29"
  },
  {
    id: 4,
    title: "西湖环湖徒步",
    location: "浙江省杭州市",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    isRecap: true,
    author: {
      name: "湖畔漫步",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    timeAgo: "1天前",
    distance: "6.8 km",
    duration: "2小时",
    elevation: "45 m",
    rating: 3,
    trailName: "西湖环湖步道",
    commentCount: 2,
    date: "May 28"
  }
] 