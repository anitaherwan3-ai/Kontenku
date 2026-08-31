import {
  PippitProject,
  DigitalAvatar,
  BackgroundMusicTrack,
  ProductAnalysis
} from '../types';

export const SAMPLE_AVATARS: DigitalAvatar[] = [
  {
    id: 'avatar-maya',
    name: 'Maya Putri',
    role: 'UGC Creator & TikTok Host',
    gender: 'female',
    avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    accent: 'Indonesian (Natural Jakarta Slang / Casual)',
    supportedLanguages: ['Indonesian', 'English', 'Malay'],
    defaultVoice: 'Kore',
    tags: ['Gen-Z UGC', 'Skincare & Beauty', 'High Energy', 'Viral Hook']
  },
  {
    id: 'avatar-rian',
    name: 'Rian Pratama',
    role: 'Tech & Gadget Reviewer',
    gender: 'male',
    avatarImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    accent: 'Indonesian (Tech Casual / Javanese Nuance)',
    supportedLanguages: ['Indonesian', 'English'],
    defaultVoice: 'Puck',
    tags: ['Tech Specs', 'Honest Review', 'Unboxing', 'Problem Solver']
  },
  {
    id: 'avatar-sarah',
    name: 'Sarah Anderson',
    role: 'International Brand Host',
    gender: 'female',
    avatarImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    accent: 'English (US Neutral / Professional)',
    supportedLanguages: ['English', 'Indonesian'],
    defaultVoice: 'Zephyr',
    tags: ['Luxury Brand', 'Storytelling', 'Elegance', 'Global Reach']
  },
  {
    id: 'avatar-budi',
    name: 'Kang Budi',
    role: 'Friendly Merchant / E-commerce Seller',
    gender: 'male',
    avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    accent: 'Indonesian (Friendly Sundanese/Bandung Tone)',
    supportedLanguages: ['Indonesian', 'Sundanese'],
    defaultVoice: 'Fenrir',
    tags: ['Spill Promo', 'Direct Selling', 'Relatable', 'Flash Sale']
  },
  {
    id: 'avatar-chloe',
    name: 'Chloe Kim',
    role: 'Lifestyle & Wellness Influencer',
    gender: 'female',
    avatarImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    accent: 'Indonesian / English (Aesthetic Soft-spoken)',
    supportedLanguages: ['Indonesian', 'English'],
    defaultVoice: 'Charon',
    tags: ['Aesthetic Lifestyle', 'ASMR Unboxing', 'Pastel Vibe', 'Health']
  }
];

export const SAMPLE_BGM_TRACKS: BackgroundMusicTrack[] = [
  {
    id: 'bgm-1',
    title: 'TikTok Viral Bounce (Fast Rhythm)',
    genre: 'TikTok Viral Beat',
    bpm: 128,
    duration: '0:30',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3'
  },
  {
    id: 'bgm-2',
    title: 'Modern E-Commerce Upbeat Pop',
    genre: 'Commerce Upbeat',
    bpm: 120,
    duration: '0:30',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-fun-and-games-6.mp3'
  },
  {
    id: 'bgm-3',
    title: 'Aesthetic Coffee Morning Lo-Fi',
    genre: 'Lo-Fi Chill',
    bpm: 85,
    duration: '0:30',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-chill-bro-494.mp3'
  },
  {
    id: 'bgm-4',
    title: 'Luxury Cinematic Reveal Stems',
    genre: 'Cinematic Drama',
    bpm: 110,
    duration: '0:30',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3'
  }
];

export const DEMO_PRESET_PRODUCTS: Array<{
  id: string;
  name: string;
  url: string;
  category: string;
  image: string;
  analysis: ProductAnalysis;
}> = [
  {
    id: 'preset-serum',
    name: 'GlowLuxe 10% Niacinamide + 3X Ceramide Barrier Serum',
    url: 'https://shopee.co.id/glowluxe-official/barrier-glow-serum-30ml',
    category: 'Skincare & Beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    analysis: {
      productName: 'GlowLuxe 10% Niacinamide + 3X Ceramide Barrier Serum',
      category: 'Skincare & Beauty',
      brandName: 'GlowLuxe Skin Lab',
      pricePoint: 'Rp 89.000 (Flash Sale Disc 45%)',
      targetAudience: 'Wanita 18-32 tahun, kulit kusam, berminyak & bekas jerawat membandel',
      uniqueSellingPoints: [
        'Mencerahkan bekas jerawat PIE & PIH dalam 7 hari pemakaian rutin',
        'Tekstur watery gel tidak lengket, cepat meresap di bawah makeup',
        '3X Ceramide Complex memperkuat skin barrier yang rusak akibat eksfoliasi berlebih',
        'BPOM, Halal, Fragrance-Free aman untuk kulit sensitif'
      ],
      painPointsSolved: [
        'Kulit kusam meski sudah pakai banyak skincare',
        'Bekas jerawat kehitaman yang susah hilang',
        'Makeup sering cakey karena kulit dehidrasi'
      ],
      recommendedHook: '“Stop buang duit jutaan buat facial! Coba racun serum 80 ribuan yang viral di TikTok ini!”',
      toneOfVoice: 'Excited UGC, jujur, relatable, to-the-point',
      visualAesthetic: 'Clean minimal pastel, aesthetic droplet macro shots, radiant dewy skin',
      confidenceScore: 98
    }
  },
  {
    id: 'preset-keyboard',
    name: 'VortexStrike CyberKey V3 Wireless Mechanical RGB Keyboard',
    url: 'https://tokopedia.com/vortexgear/vortexstrike-cyberkey-v3-wireless',
    category: 'Computer & Gaming Gear',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    analysis: {
      productName: 'VortexStrike CyberKey V3 Wireless Mechanical RGB Keyboard',
      category: 'Gaming & Tech Accessories',
      brandName: 'VortexGear',
      pricePoint: 'Rp 459.000',
      targetAudience: 'Gamers, software engineers, WFH professionals 20-35 tahun',
      uniqueSellingPoints: [
        'Hot-swappable Custom Gateron Yellow Switch dengan suara creamy thocky',
        'Tri-mode Connection (Bluetooth 5.3, 2.4Ghz Ultra Low Latency, USB-C)',
        'South-facing RGB 22 Mode dengan Aluminium Base Frame premium',
        'Baterai tahan 200 jam pemakaian non-stop'
      ],
      painPointsSolved: [
        'Meja kerja berantakan karena kabel melintang',
        'Mengetik lama bikin jari pegal dan lelah',
        'Keyboard kantor yang bunyinya berisik dan ringkih'
      ],
      recommendedHook: '“Setup meja lo masih cupu? Ini rahasia mechanical keyboard wireless dengan sound thock paling satisfying!”',
      toneOfVoice: 'Tech enthusiast, energik, crisp, aesthetic sound test focus',
      visualAesthetic: 'Cyberpunk neon RGB, clean dark desk setup, macro switch sound closeups',
      confidenceScore: 96
    }
  },
  {
    id: 'preset-tumbler',
    name: 'HydroPulse AeroChilled 1200ml Insulated Smart Tumbler',
    url: 'https://tiktok.com/@hydropulse/video/smart-tumbler-ice-retention-test',
    category: 'Lifestyle & Kitchenware',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    analysis: {
      productName: 'HydroPulse AeroChilled 1200ml Insulated Smart Tumbler',
      category: 'Lifestyle & Drinkware',
      brandName: 'HydroPulse',
      pricePoint: 'Rp 149.000 (Beli 1 Dapat 2 Selama Live)',
      targetAudience: 'Anak kuliahan, commuter kantor, gym enthusiast, penggemar es kopi',
      uniqueSellingPoints: [
        'Menjaga es batu tetap beku dingin hingga 36 jam',
        'Stainless Steel 316 Medical Grade tahan karat dan bebas bau',
        'Leakproof 360 Handle ergonomis pas di cup holder mobil',
        'Warna aesthetic matte pastel trendy TikTok'
      ],
      painPointsSolved: [
        'Es kopi cepat mencair dan jadi hambar saat siang hari',
        'Tumbler biasa sering bocor dan membasahi tas laptop',
        'Ukuran kecil bikin bolak-balik isi air'
      ],
      recommendedHook: '“Tes es batu dibiarkan di dalam mobil 36 jam di bawah terik matahari, meleleh gak ya?!”',
      toneOfVoice: 'Challenge-style, live test experiment, shock factor',
      visualAesthetic: 'Ice splash slow-motion, thermal test thermometer overlay, vibrant pastel lifestyle',
      confidenceScore: 99
    }
  }
];

export const INITIAL_DEFAULT_PROJECT: PippitProject = {
  id: 'proj-pippit-demo',
  title: 'GlowLuxe Viral TikTok Ad Campaign 2026',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  inputData: {
    productUrl: DEMO_PRESET_PRODUCTS[0].url,
    productAnalysis: DEMO_PRESET_PRODUCTS[0].analysis,
    uploadedAssets: [
      {
        id: 'asset-1',
        name: 'product-bottle-front.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
        size: '1.4 MB',
        processed: true,
        tags: ['Hero Product', 'Packaging', 'Front View']
      },
      {
        id: 'asset-2',
        name: 'dropper-texture-macro.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1608248597359-00f074d6428c?w=800&auto=format&fit=crop&q=80',
        size: '2.1 MB',
        processed: true,
        tags: ['Texture Macro', 'Dropper', 'Glow Formula']
      },
      {
        id: 'asset-3',
        name: 'brand-logo-white.png',
        type: 'logo',
        url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80',
        size: '180 KB',
        tags: ['Brand Logo', 'Transparent', 'Vector']
      },
      {
        id: 'asset-4',
        name: 'ugc-girl-applying-serum.mp4',
        type: 'video',
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
        size: '5.6 MB',
        duration: 8,
        tags: ['B-roll Action', 'Model UGC', 'Skin Demo']
      },
      {
        id: 'asset-5',
        name: 'before-after-7days.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
        size: '1.9 MB',
        processed: true,
        tags: ['Before-After', 'Social Proof', '7-Days Result']
      }
    ],
    promptConcept: 'Buatkan video iklan TikTok UGC durasi 15 detik dengan format problem-solution. Tampilkan hook membandingkan facial jutaan vs serum 80rb, tunjukkan tekstur bening watery, dan CTA promo diskon 45% klik keranjang kuning.',
    adGoal: 'conversion',
    aspectRatio: '9:16',
    duration: '15s',
    targetLanguage: 'id',
    selectedTone: 'excited_ugc'
  },
  storyboard: [
    {
      id: 'scene-1',
      sceneNumber: 1,
      sceneType: 'hook',
      durationSeconds: 3,
      voiceoverText: 'Stop buang jutaan rupiah buat perawatan klinik! Rahasia kulit glowing kaca ternyata cuma serum ini!',
      avatarAction: 'Ekspresi kaget sambil menunjuk ke kamera lalu mengangkat produk serum',
      visualPrompt: 'POV front view: A trendy Gen-Z Indonesian girl with glowing dewy glass skin holding GlowLuxe serum bottle, energetic gesture, bright aesthetic bathroom backdrop, TikTok style 9:16 vertical high quality',
      visualUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      onScreenText: 'STOP BUANG JUTAAN! 😱 Kulit Glowing Modal 80K',
      cameraMovement: 'zoom_in',
      transition: 'zoom_blur',
      bgSoundEffect: 'Whoosh + Record Scratch'
    },
    {
      id: 'scene-2',
      sceneNumber: 2,
      sceneType: 'problem',
      durationSeconds: 3,
      voiceoverText: 'Pernah gak sih kesel punya bekas jerawat kehitaman yang gak pernah pudar padahal udah coba macam-macam?',
      avatarAction: 'Menunjuk pipi dengan ekspresi relate dan sedikit frustasi',
      visualPrompt: 'Close up skin macro view, subtle realistic red spots on cheek dissolving, clean clinical comparison lighting, Seedance high fidelity texture',
      visualUrl: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=800&auto=format&fit=crop&q=80',
      onScreenText: 'Bekas Jerawat & Flek Susah Hilang? 💔',
      cameraMovement: 'pan_right',
      transition: 'swipe_left',
      bgSoundEffect: 'Subtle Heartbeat'
    },
    {
      id: 'scene-3',
      sceneNumber: 3,
      sceneType: 'demo',
      durationSeconds: 4,
      voiceoverText: 'Ini dia GlowLuxe Serum! 10% Niacinamide murni plus 3X Ceramide. Teksturnya watery banget, langsung meresap dalam 5 detik tanpa lengket!',
      avatarAction: 'Meneteskan serum ke punggung tangan dan mengusapkannya hingga berkilau',
      visualPrompt: 'Ultra macro slow motion: clear golden serum droplet falling from glass pipette onto smooth skin, instant hydration glow shimmer, pastel studio backdrop',
      visualUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      onScreenText: '✨ 10% Niacinamide + 3X Ceramide (Watery & Anti Lengket)',
      cameraMovement: 'zoom_in',
      transition: 'cut',
      bgSoundEffect: 'Water Droplet Pop'
    },
    {
      id: 'scene-4',
      sceneNumber: 4,
      sceneType: 'social_proof',
      durationSeconds: 2.5,
      voiceoverText: 'Lihat perbedaannya dalam 7 hari! Skin barrier jadi kuat dan pori-pori kelihatan lebih halus.',
      avatarAction: 'Menunjukkan foto before-after di ponsel dengan senyum percaya diri',
      visualPrompt: 'Split screen comparison slider: Day 1 dull skin vs Day 7 radiant porcelain skin, verified buyer review bubbles with 5 stars',
      visualUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
      onScreenText: '🔥 7 HARI HASIL TERLIHAT (15.000+ Ulasan ⭐5.0)',
      cameraMovement: 'static',
      transition: 'zoom_blur',
      bgSoundEffect: 'Ding Sparkle'
    },
    {
      id: 'scene-5',
      sceneNumber: 5,
      sceneType: 'cta',
      durationSeconds: 2.5,
      voiceoverText: 'Lagi ada promo flash sale diskon 45%! Klik keranjang kuning di kiri bawah sebelum kehabisan!',
      avatarAction: 'Menunjuk ke sudut kiri bawah layar dengan ekspresi antusias',
      visualPrompt: 'Big glowing TikTok Yellow Cart animation pulsing at bottom left, limited stock counter ticker, high conversion e-commerce CTA',
      visualUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      onScreenText: '👇 KLIK KERANJANG KUNING (DISKON 45% HARI INI)',
      cameraMovement: 'dynamic_shake',
      transition: 'glitch',
      bgSoundEffect: 'Cash Register Cha-Ching'
    }
  ],
  selectedAvatar: SAMPLE_AVATARS[0],
  ttsSettings: {
    voiceId: 'Kore',
    language: 'id-ID',
    speed: 1.1,
    pitch: 1.05,
    emotion: 'excited'
  },
  promptChainSteps: [
    {
      id: 'chain-1',
      stepNumber: 1,
      title: 'Hook Optimization (0-3s Retention)',
      category: 'hook',
      originalPrompt: 'Serum ini bagus untuk memutihkan kulit wajah wanita',
      refinedPrompt: '“Stop buang jutaan rupiah buat perawatan klinik! Rahasia kulit glowing kaca ternyata cuma serum 80 ribuan ini!”',
      aiSuggestedImprovements: [
        'Tambahkan trigger kontras harga (Jutaan vs Puluhan Ribu)',
        'Gunakan kata kunci emosional "Stop buang duit"',
        'Visual: Tampilkan ekspresi kaget avatar di detik pertama'
      ],
      status: 'applied'
    },
    {
      id: 'chain-2',
      stepNumber: 2,
      title: 'Seedance Visual Enhancement (Macro Lighting & Backdrop)',
      category: 'visual_seedance',
      originalPrompt: 'Tampilkan botol serum di atas meja putih biasa',
      refinedPrompt: 'Cinematic 9:16 slow-motion: Glass dropper dispensing golden hydrating dewdrop with soft sunlight flare, pastel rose gold aesthetic reflections, 4k macro clarity',
      aiSuggestedImprovements: [
        'Ubah lighting ke Golden Hour lembut untuk efek kulit bercahaya',
        'Gunakan efek micro-droplet untuk menonjolkan tekstur cepat meresap',
        'Ganti latar belakang ke aesthetic bathroom vanity'
      ],
      status: 'applied'
    },
    {
      id: 'chain-3',
      stepNumber: 3,
      title: 'Dialect & Voiceover Pacing',
      category: 'avatar_speech',
      originalPrompt: 'Suara membaca naskah secara standar',
      refinedPrompt: 'Aksen Jakarta casual Gen-Z, intonasi antusias di awal (Hook), nada meyakinkan saat menjelaskan kandungan ceramide, dan urgensi tinggi di akhir (CTA)',
      aiSuggestedImprovements: [
        'Tingkatkan playback speed ke 1.1x agar ritme sesuai standar video viral TikTok',
        'Tambahkan jeda mikro 0.2 detik sebelum kata "GlowLuxe"'
      ],
      status: 'applied'
    },
    {
      id: 'chain-4',
      stepNumber: 4,
      title: 'Karaoke Caption & CTA Yellow Cart Anchor',
      category: 'cta_offer',
      originalPrompt: 'Teks di layar promo diskon',
      refinedPrompt: 'Word-pop dynamic yellow font dengan outline hitam tebal, sinkronisasi audio per kata, dan panah animasi berkedip menunjuk ke Keranjang Kuning',
      aiSuggestedImprovements: [
        'Gunakan warna kuning #FFE600 yang identik dengan konversi TikTok Shop',
        'Tambahkan ticker countdown "Promo Berakhir 2 Jam Lagi"'
      ],
      status: 'applied'
    }
  ],
  captionStyle: {
    fontFamily: 'Montserrat',
    fontSize: 24,
    textColor: '#FFFFFF',
    highlightColor: '#FACC15', // Yellow TikTok
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    strokeColor: '#000000',
    strokeWidth: 3,
    positionY: 76,
    animation: 'karaoke_glow',
    uppercase: true
  },
  selectedBgm: SAMPLE_BGM_TRACKS[0],
  bgmVolume: 22,
  voiceVolume: 88,
  scheduledPosts: [
    {
      id: 'post-1',
      platform: 'tiktok',
      scheduledTime: '2026-08-28 19:30 WIB',
      scheduledDate: '2026-08-28',
      scheduledTimeOnly: '19:30',
      accountId: 'acc-tt-1',
      accountHandle: '@glowluxe.official',
      primeTimeTag: 'TikTok Prime-Time (19:30 WIB)',
      autoPublishEnabled: true,
      videoVariant: '9:16 Vertical (1080p H.264)',
      caption: 'Beneran gak nyangka serum 80 ribuan hasilnya bisa sebagus ini 😭✨ Yang punya masalah bekas jerawat item wajib cobain mumpung diskon 45%! #GlowLuxe #SerumViral #RacunTikTok #SkincareRoutine #FYP #SpillSkincare',
      hashtags: ['#GlowLuxe', '#SerumViral', '#RacunTikTok', '#SkincareRoutine', '#FYP'],
      status: 'scheduled',
      targetAudienceName: 'TikTok FYP Indonesia (Beauty & Skincare 18-34)',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'post-2',
      platform: 'instagram',
      scheduledTime: '2026-08-28 20:15 WIB',
      scheduledDate: '2026-08-28',
      scheduledTimeOnly: '20:15',
      accountId: 'acc-ig-1',
      accountHandle: '@glowluxe.skinlab',
      primeTimeTag: 'IG Reels Peak Engagement (20:15 WIB)',
      autoPublishEnabled: true,
      videoVariant: '9:16 Vertical (1080p H.264)',
      caption: 'Transformasi 7 hari pakai GlowLuxe Barrier Serum! Tekstur ringan, anti-lengket, dan bikin makeup nempel seharian. Tap link di bio untuk klaim kupon diskon! ✨🛍️ #ReelsIndonesia #SkincareReview #BeautyHacks',
      hashtags: ['#ReelsIndonesia', '#SkincareReview', '#BeautyHacks', '#GlowSkin'],
      status: 'draft',
      targetAudienceName: 'IG Reels Explore (Lifestyle & Skincare)',
      thumbnailUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'post-3',
      platform: 'facebook',
      scheduledTime: '2026-08-29 11:00 WIB',
      scheduledDate: '2026-08-29',
      scheduledTimeOnly: '11:00',
      accountId: 'acc-fb-1',
      accountHandle: 'GlowLuxe Indonesia',
      primeTimeTag: 'FB Ads Lunch Break (11:00 WIB)',
      autoPublishEnabled: false,
      videoVariant: '1:1 Square (1080p)',
      caption: 'Solusi praktis wajah glowing bebas noda hitam tanpa mahal. Sudah teruji BPOM & Halal. Promo terbatas beli 1 gratis mini toner!',
      hashtags: ['#SkincareHalal', '#PromoSkincare', '#GlowLuxe'],
      status: 'draft',
      targetAudienceName: 'Facebook Ads Advantage+ Campaign',
      thumbnailUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80'
    }
  ],
  uploadHistory: [
    {
      id: 'hist-101',
      projectId: 'proj-pippit-demo',
      postTitle: 'Spill Skincare Noda Hitam Serum GlowLuxe',
      platform: 'tiktok',
      accountId: 'acc-tt-1',
      accountName: 'GlowLuxe Official TikTok Shop',
      accountHandle: '@glowluxe.official',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      timestamp: '2026-08-27 19:30:12 WIB',
      status: 'success',
      postUrl: 'https://www.tiktok.com/@glowluxe.official/video/7391823901827391',
      videoVariant: '9:16 Vertical 1080p (MP4)',
      captionPreview: 'Beneran gak nyangka serum 80 ribuan hasilnya bisa sebagus ini 😭✨ Yang punya masalah bekas jerawat item wajib cobain mumpung diskon...',
      hashtags: ['#GlowLuxe', '#SerumViral', '#RacunTikTok'],
      shopTagActive: true,
      stats: {
        views: 142500,
        likes: 12840,
        comments: 630,
        shares: 1420,
        cartClicks: 4890
      }
    },
    {
      id: 'hist-102',
      projectId: 'proj-pippit-demo',
      postTitle: 'Review Jujur 7 Hari Glow Skin Barrier',
      platform: 'instagram',
      accountId: 'acc-ig-1',
      accountName: 'GlowLuxe Skin Lab Indonesia',
      accountHandle: '@glowluxe.skinlab',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
      timestamp: '2026-08-27 20:15:45 WIB',
      status: 'success',
      postUrl: 'https://www.instagram.com/reel/C8j283yPqL1/',
      videoVariant: '9:16 Vertical 1080p (MP4)',
      captionPreview: 'Transformasi 7 hari pakai GlowLuxe Barrier Serum! Tekstur ringan, anti-lengket, dan bikin makeup nempel seharian...',
      hashtags: ['#ReelsIndonesia', '#SkincareReview'],
      shopTagActive: true,
      stats: {
        views: 68400,
        likes: 4920,
        comments: 210,
        shares: 580,
        cartClicks: 1740
      }
    },
    {
      id: 'hist-103',
      projectId: 'proj-pippit-demo',
      postTitle: 'Affiliate UGC Flash Sale Keranjang Kuning',
      platform: 'tiktok',
      accountId: 'acc-tt-2',
      accountName: 'Racun Skincare FYP (Affiliate)',
      accountHandle: '@racunskincare.viral',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      timestamp: '2026-08-26 12:15:00 WIB',
      status: 'success',
      postUrl: 'https://www.tiktok.com/@racunskincare.viral/video/739091823901928',
      videoVariant: '9:16 Vertical 1080p (MP4)',
      captionPreview: 'Jangan skip video ini kalau gamau nyesel! Serum viral diskon 45% cuma hari ini di keranjang kuning!',
      hashtags: ['#SpillRacunTikTok', '#FlashSale'],
      shopTagActive: true,
      stats: {
        views: 92300,
        likes: 8120,
        comments: 440,
        shares: 980,
        cartClicks: 3120
      }
    },
    {
      id: 'hist-104',
      projectId: 'proj-pippit-demo',
      postTitle: 'Campaign Feed Promo Beli 1 Gratis 1',
      platform: 'facebook',
      accountId: 'acc-fb-1',
      accountName: 'GlowLuxe Indonesia Fanspage',
      accountHandle: 'GlowLuxe Indonesia',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      timestamp: '2026-08-26 19:00:10 WIB',
      status: 'failed',
      errorCode: 'META_GRAPH_ACCESS_TOKEN_REVOKED',
      errorMessage: 'Token akses Meta Graph API telah kedaluwarsa (Expired: 2026-08-25). Silakan segarkan OAuth Token di Dashboard Akun.',
      retryCount: 1,
      videoVariant: '1:1 Square 1080p (MP4)',
      captionPreview: 'Solusi praktis wajah glowing bebas noda hitam tanpa mahal. Sudah teruji BPOM & Halal...',
      hashtags: ['#SkincareHalal', '#PromoSkincare']
    },
    {
      id: 'hist-105',
      projectId: 'proj-pippit-demo',
      postTitle: 'Unboxing Serum & Tes Tekstur Macro',
      platform: 'tiktok',
      accountId: 'acc-tt-1',
      accountName: 'GlowLuxe Official TikTok Shop',
      accountHandle: '@glowluxe.official',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      timestamp: '2026-08-25 21:00:00 WIB',
      status: 'success',
      postUrl: 'https://www.tiktok.com/@glowluxe.official/video/738981290381029',
      videoVariant: '9:16 Vertical 1080p (MP4)',
      captionPreview: 'Texture check! Bener-bener seringan air dan langsung menyerap dalam hitungan detik...',
      hashtags: ['#ASMRSkincare', '#GlowLuxe'],
      shopTagActive: true,
      stats: {
        views: 105200,
        likes: 9340,
        comments: 512,
        shares: 1100,
        cartClicks: 3640
      }
    }
  ],
  connectedAccounts: [
    {
      id: 'acc-tt-1',
      platform: 'tiktok',
      accountName: 'GlowLuxe Official TikTok Shop',
      accountHandle: '@glowluxe.official',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      accountType: 'business',
      followersCount: '248.5K',
      status: 'connected',
      shopLinked: true,
      category: 'Beauty & Personal Care',
      brandTag: 'Toko Utama (Official Shop)',
      productCatalogLinked: 'Katalog TikTok Shop ID: #ID-TTSHOP-9921',
      autoSyncOrders: true,
      tokenExpiresAt: '2026-11-20'
    },
    {
      id: 'acc-tt-2',
      platform: 'tiktok',
      accountName: 'Racun Skincare FYP (Affiliate)',
      accountHandle: '@racunskincare.viral',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      accountType: 'creator',
      followersCount: '89.2K',
      status: 'connected',
      shopLinked: true,
      category: 'Affiliate UGC Reviewer',
      brandTag: 'Akun Affiliate UGC 1',
      productCatalogLinked: 'TikTok Creator Showcase ID: #TT-CREATOR-441',
      autoSyncOrders: false,
      tokenExpiresAt: '2026-10-15'
    },
    {
      id: 'acc-ig-1',
      platform: 'instagram',
      accountName: 'GlowLuxe Skin Lab Indonesia',
      accountHandle: '@glowluxe.skinlab',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
      accountType: 'business',
      followersCount: '174.0K',
      status: 'connected',
      shopLinked: true,
      category: 'Instagram Shopping / Reels',
      brandTag: 'Instagram Brand Page',
      productCatalogLinked: 'Meta Commerce Catalog #MC-88319',
      autoSyncOrders: true,
      tokenExpiresAt: '2026-12-01'
    },
    {
      id: 'acc-fb-1',
      platform: 'facebook',
      accountName: 'GlowLuxe Indonesia Fanspage',
      accountHandle: 'GlowLuxe Indonesia',
      pageName: 'GlowLuxe Indonesia (Page ID: 1092837491)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      accountType: 'business',
      followersCount: '92.4K',
      status: 'connected',
      shopLinked: false,
      category: 'Facebook Page & Meta Ads',
      brandTag: 'Fanspage FB Ads',
      productCatalogLinked: 'Meta Pixel ID: 489201948102',
      autoSyncOrders: false,
      tokenExpiresAt: '2026-12-15'
    }
  ],
  watermarkConfig: {
    enabled: true,
    type: 'handle',
    text: '@glowluxe.official',
    position: 'top-right',
    opacity: 0.8,
    scale: 100,
    style: 'pill_badge',
    showTimestamp: false,
    showVerifiedIcon: true
  },
  brandKit: {
    brandName: 'GlowLuxe Skin Lab',
    brandTagline: 'Dermatology-Grade Skin Barrier Science',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80',
    primaryColor: '#6366f1', // Indigo
    secondaryColor: '#f59e0b', // Amber/Gold
    accentColor: '#10b981', // Emerald
    neutralColor: '#0f172a', // Slate Dark
    backgroundColor: '#ffffff',
    fontFamilyHeading: 'Plus Jakarta Sans',
    fontFamilyBody: 'Plus Jakarta Sans',
    captionHighlightColor: '#fbbf24', // Amber 400
    captionTextColor: '#ffffff',
    captionBoxColor: '#0f172a',
    watermarkEnabled: true,
    watermarkPosition: 'top-right',
    badgeStyle: 'modern_pill',
    defaultToneOfVoice: 'Excited UGC, jujur, relatable, to-the-point',
    autoApplyToCaptions: true,
    autoApplyToWatermark: true,
    autoApplyToStickers: true
  },
  threeActScript: {
    scriptTitle: '3-Act Viral TikTok Ad: Problem-Solution & Flash Sale',
    overallConcept: 'Struktur naskah 3 babak dengan Hook kontras harga, Demo tekstur cepat meresap, dan CTA diskon kilat keranjang kuning.',
    targetHookAngle: 'Curiosity & Price Contrast Hook',
    targetPacing: 'Fast-paced & High Retention',
    estimatedWatchTime: '15.0s (Target Completion: 48%)',
    acts: [
      {
        actNumber: 1,
        actType: 'hook',
        actTitle: 'Babak 1: The Viral Hook (0-3s)',
        durationSeconds: 3,
        voiceoverText: 'Stop buang jutaan rupiah buat perawatan klinik! Rahasia kulit glowing kaca ternyata cuma serum 80 ribuan ini!',
        onScreenText: '😱 STOP BUANG JUTAAN! Kulit Glowing Modal 80K',
        avatarAction: 'Ekspresi kaget sambil menunjuk ke kamera lalu mengangkat produk serum',
        visualPrompt: 'POV front view: A trendy Gen-Z Indonesian girl with glowing dewy glass skin holding GlowLuxe serum bottle, energetic gesture, bright aesthetic bathroom backdrop, TikTok style 9:16 vertical high quality',
        cameraMovement: 'zoom_in',
        transition: 'zoom_blur',
        bgSoundEffect: 'Whoosh + Record Scratch',
        psychologicalAngle: 'Price Contrast & Visceral Problem Agitation',
        keywordsUsed: ['serum viral', 'kulit glowing', 'diskon 80k', 'perawatan klinik'],
        visualUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
      },
      {
        actNumber: 2,
        actType: 'demo',
        actTitle: 'Babak 2: The Demo & Problem Solution (3-12s)',
        durationSeconds: 8,
        voiceoverText: 'Ini dia GlowLuxe Serum! 10% Niacinamide murni plus 3X Ceramide. Teksturnya watery banget, langsung meresap dalam 5 detik tanpa rasa lengket sama sekali!',
        onScreenText: '✨ 10% Niacinamide + 3X Ceramide (Watery & Cepat Meresap)',
        avatarAction: 'Meneteskan serum ke pipi/tangan lalu mengusapnya dengan efek glowing seketika',
        visualPrompt: 'Ultra macro slow motion: clear golden serum droplet falling from glass pipette onto smooth skin, instant hydration glow shimmer, pastel studio backdrop',
        cameraMovement: 'pan_right',
        transition: 'cut',
        bgSoundEffect: 'Water Droplet Pop + Thock',
        psychologicalAngle: 'Sensory ASMR Demo & Formula USP Proof',
        keywordsUsed: ['10% Niacinamide', '3X Ceramide', 'Watery Gel', 'Cepat Meresap'],
        visualUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
      },
      {
        actNumber: 3,
        actType: 'cta',
        actTitle: 'Babak 3: The Urgency CTA & Yellow Cart (12-15s)',
        durationSeconds: 4,
        voiceoverText: 'Lagi ada diskon flash sale 45% cuma buat 50 pembeli pertama! Klik keranjang kuning di kiri bawah sekarang juga sebelum kehabisan!',
        onScreenText: '👇 KLIK KERANJANG KUNING (DISKON 45% HARI INI)',
        avatarAction: 'Menunjuk ke sudut kiri bawah layar dengan ekspresi antusias',
        visualPrompt: 'Big glowing TikTok Yellow Cart animation pulsing at bottom left, limited stock counter ticker, high conversion e-commerce CTA',
        cameraMovement: 'dynamic_shake',
        transition: 'glitch',
        bgSoundEffect: 'Cash Register Cha-Ching',
        psychologicalAngle: 'Scarcity Fear & Direct Action Command',
        keywordsUsed: ['diskon 45%', 'flash sale', 'keranjang kuning', 'stok terbatas'],
        visualUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
      }
    ]
  },
  dynamicStickers: [
    {
      id: 'sticker-countdown-1',
      type: 'countdown_timer',
      title: '⚡ FLASH SALE BERAKHIR DALAM',
      subTitle: 'Stok Terbatas Hari Ini',
      countdownMinutes: 94,
      positionX: 50,
      positionY: 8,
      scale: 100,
      animation: 'pulse',
      colorTheme: 'urgent_red',
      visibleScenes: 'all',
      enabled: true
    },
    {
      id: 'sticker-discount-1',
      type: 'flash_discount',
      title: 'DISKON 45% OFF',
      subTitle: 'Khusus Pengguna Baru',
      discountPercent: 45,
      positionX: 84,
      positionY: 22,
      scale: 105,
      animation: 'bounce',
      colorTheme: 'tiktok_yellow',
      visibleScenes: 'all',
      enabled: true
    },
    {
      id: 'sticker-yellow-cart-1',
      type: 'yellow_cart_arrow',
      title: '👇 KLIK KERANJANG KUNING',
      subTitle: 'Klaim Voucher Gratis Ongkir',
      positionX: 18,
      positionY: 82,
      scale: 100,
      animation: 'bounce',
      colorTheme: 'tiktok_yellow',
      visibleScenes: 'cta_only',
      enabled: true
    },
    {
      id: 'sticker-bpom-1',
      type: 'guarantee_badge',
      title: '100% BPOM & ORI',
      subTitle: 'Garansi Uang Kembali 100%',
      positionX: 16,
      positionY: 18,
      scale: 90,
      animation: 'floating',
      colorTheme: 'emerald_trust',
      visibleScenes: 'all',
      enabled: true
    },
    {
      id: 'sticker-rating-1',
      type: 'rating_social_proof',
      title: '⭐ 4.9/5.0 (15.2K+ Terjual)',
      subTitle: 'Produk Terlaris Skincare FYP',
      positionX: 50,
      positionY: 28,
      scale: 95,
      animation: 'floating',
      colorTheme: 'purple_vip',
      visibleScenes: 'all',
      enabled: false
    }
  ],
  selectedHookId: 'hook-preset-1',
  hookVariants: [
    {
      id: 'hook-preset-1',
      angleType: 'curiosity_gap',
      angleTitle: 'Curiosity & Secret Reveal (Hook 1)',
      voiceoverText: 'Stop buang jutaan rupiah buat perawatan klinik! Rahasia kulit glowing kaca ternyata cuma serum 80 ribuan ini!',
      onScreenText: '😱 JANGAN BELI DULU SEBELUM LIAT INI!',
      visualPrompt: 'Close-up UGC host holding serum with wide shocked eyes, ultra crisp 9:16 portrait, beauty ring light, viral TikTok hook angle',
      visualUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      predictedRetention3s: 92.4,
      predictedCtrLift: '+34.5% CTR',
      psychologicalTrigger: 'Curiosity Gap + Secret Unlocked',
      tags: ['Viral Hook', 'High Retention', 'TikTok FYP'],
      isWinningVariant: true
    },
    {
      id: 'hook-preset-2',
      angleType: 'problem_agitation',
      angleTitle: 'Visceral Pain Point Agitation (Hook 2)',
      voiceoverText: 'Capek banget kan kalau beli serum abal-abal bikin bruntusan parah? Ini solusi yang beneran aman dan BPOM!',
      onScreenText: '🛑 CAPEK DITIPU BARANG ABAL-ABAL?',
      visualPrompt: 'Frustrated expression touching cheek irritation, dramatic snap transition to glowing fresh hydrated skin',
      visualUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
      predictedRetention3s: 88.7,
      predictedCtrLift: '+22.8% CTR',
      psychologicalTrigger: 'Relatable Problem Callout',
      tags: ['Problem Solver', 'Empathy Hook', 'Trust Builder']
    },
    {
      id: 'hook-preset-3',
      angleType: 'price_shock',
      angleTitle: 'Price Shock & Scarcity Urgency (Hook 3)',
      voiceoverText: 'Gak masuk akal! Serum sebagus ini lagi ada diskon flash sale 45% khusus 50 pembeli tercepat hari ini!',
      onScreenText: '🔥 DISKON FLASH SALE 45% HARI INI!',
      visualPrompt: 'Price slashed animation graphic overlay with pulsing red urgency border and shiny serum bottle hero shot',
      visualUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      predictedRetention3s: 94.1,
      predictedCtrLift: '+41.2% CTR',
      psychologicalTrigger: 'Extreme Bargain + Scarcity Fear',
      tags: ['Direct Promo', 'E-commerce Conversion', 'Flash Sale']
    },
    {
      id: 'hook-preset-4',
      angleType: 'social_proof',
      angleTitle: 'Viral Social Proof & Sold Out (Hook 4)',
      voiceoverText: 'Pantesan ludes 15.000 pcs dalam seminggu di TikTok Shop! Ternyata emang seampuh ini buat pudarin bekas jerawat.',
      onScreenText: '⭐ 15.000+ SOLD OUT! RAHASIA VIRAL',
      visualPrompt: 'Screen recording montage of 5-star customer ratings scrolling rapidly behind happy smiling creator',
      visualUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      predictedRetention3s: 89.9,
      predictedCtrLift: '+28.4% CTR',
      psychologicalTrigger: 'Herd Behavior & Social Validation',
      tags: ['Social Proof', 'FOMO', 'Top Rated']
    },
    {
      id: 'hook-preset-5',
      angleType: 'skeptical_reverse',
      angleTitle: 'Skeptical Reverse Psychology (Hook 5)',
      voiceoverText: 'Jujur awalnya aku kira serum ini cuma overhyped dan endorse doang, tapi pas tes seminggu ternyata hasilnya bikin kaget!',
      onScreenText: '🤔 AWALNYA SKEPTIS, TAPI TERNYATA...',
      visualPrompt: 'Curious doubtful expression inspecting bottle label closely with magnifying glass aesthetic macro lens',
      visualUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      predictedRetention3s: 91.0,
      predictedCtrLift: '+31.0% CTR',
      psychologicalTrigger: 'Authentic Skepticism & Honest Review',
      tags: ['UGC Review', 'High Authenticity', 'Anti-Ad Vibe']
    }
  ],
  analytics: {
    overall: {
      impressions: 482500,
      views: 318200,
      clicks: 29400,
      ctr: 9.24,
      conversions: 1842,
      engagementRate: 8.7,
      retention3s: 78.4,
      retention15s: 41.2,
      shares: 4210,
      comments: 1890,
      estimatedRoas: 4.65
    },
    byPlatform: [
      {
        platform: 'tiktok',
        impressions: 290000,
        views: 205000,
        engagementRate: 10.4,
        costPerClick: 420,
        conversions: 1320,
        roas: 5.12
      },
      {
        platform: 'instagram',
        impressions: 145000,
        views: 89000,
        engagementRate: 7.8,
        costPerClick: 650,
        conversions: 410,
        roas: 3.84
      },
      {
        platform: 'facebook',
        impressions: 47500,
        views: 24200,
        engagementRate: 5.2,
        costPerClick: 810,
        conversions: 112,
        roas: 2.95
      }
    ],
    retentionCurve: [
      { second: 0, retentionPercentage: 100, benchmarkPercentage: 100 },
      { second: 1, retentionPercentage: 92, benchmarkPercentage: 84 },
      { second: 2, retentionPercentage: 85, benchmarkPercentage: 72 },
      { second: 3, retentionPercentage: 78, benchmarkPercentage: 61, dropoffNote: 'Viral Hook Passed (+17% vs Industry Avg)' },
      { second: 6, retentionPercentage: 66, benchmarkPercentage: 48 },
      { second: 9, retentionPercentage: 58, benchmarkPercentage: 38 },
      { second: 12, retentionPercentage: 49, benchmarkPercentage: 31 },
      { second: 15, retentionPercentage: 41, benchmarkPercentage: 24, dropoffNote: 'CTA Yellow Cart Triggered (+17% Conversion Spike)' }
    ],
    recommendations: [
      {
        id: 'rec-1',
        type: 'hook_optimization',
        title: 'Hook Retensi 3 Detik Sangat Kuat (+17.4% di atas rata-rata)',
        insight: 'Trigger kontras harga "Perawatan Jutaan vs Serum 80K" berhasil menahan 78.4% audiens TikTok melewati detik ke-3.',
        actionableStep: 'Gunakan variasi kalimat serupa untuk produk lain, contoh: "Jangan beli tumbler 500rb sebelum liat tes es batu ini!"',
        potentialImpact: 'Prediksi peningkatan CTR +15-22%'
      },
      {
        id: 'rec-2',
        type: 'budget_scale',
        title: 'Skala Anggaran Ads TikTok (ROAS 5.12x)',
        insight: 'TikTok Shop menghasilkan 71.6% total pesanan dengan CPC terendah (Rp 420 per klik).',
        actionableStep: 'Tingkatkan budget harian TikTok Ads sebesar 35% dan jalankan di jam ramai (18:30 - 21:30 WIB).',
        potentialImpact: 'Estimasi penambahan revenue Rp 45.000.000 / minggu'
      },
      {
        id: 'rec-3',
        type: 'creative_fatigue',
        title: 'Buat 2 Variasi UGC Baru untuk A/B Testing',
        insight: 'Frekuensi penayangan iklan sudah mencapai 3.2x pada audiens perempuan 18-24 tahun, risiko fatigue kreatif dalam 5 hari ke depan.',
        actionableStep: 'Gunakan fitur Seedance AI untuk me-remix scene 2 dengan aktor pria (Rian) atau tema unboxing ASMR.',
        potentialImpact: 'Mencegah penurunan performa CTR sebesar 28%'
      }
    ]
  }
};

export const DEFAULT_PIPPIT_PROJECT = INITIAL_DEFAULT_PROJECT;
