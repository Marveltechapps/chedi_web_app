const VEG_IMG = {
  Tomato: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&q=80',
  Spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
  Okra: 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/Gemini_Generated_Image_3xrjyb3xrjyb3xrj.png',
  "Lady's finger": 'https://chediwebsite.s3.us-east-1.amazonaws.com/extraimages/Gemini_Generated_Image_3xrjyb3xrjyb3xrj.png',
  Brinjal: 'https://chediwebsite.s3.us-east-1.amazonaws.com/images/49496.jpg',
  'Green chilli': 'https://chediwebsite.s3.us-east-1.amazonaws.com/images/771.jpg',
  'Cluster beans': 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&q=80',
  Onion: 'https://chediwebsite.s3.us-east-1.amazonaws.com/images/5453.jpg',
  Coriander: 'https://chediwebsite.s3.us-east-1.amazonaws.com/images/65072.jpg',
  Carrot: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
  Cabbage: 'https://chediwebsite.s3.us-east-1.amazonaws.com/images/2104.jpg',
}

const FALLBACK = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80'

export function vegImg(name) {
  return VEG_IMG[name] || FALLBACK
}
