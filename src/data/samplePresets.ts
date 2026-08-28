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
      caption: 'Solusi praktis wajah glowing bebas noda hitam tanpa mahal. Sudah teruji BPOM & Halal. Promo terbatas beli 1 gratis mini toner!',
      hashtags: ['#SkincareHalal', '#PromoSkincare', '#GlowLuxe'],
      status: 'draft',
      targetAudienceName: 'Facebook Ads Advantage+ Campaign',
      thumbnailUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80'
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
