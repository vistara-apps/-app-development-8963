# VibeSync - AI-Powered Music & Movie Discovery

VibeSync is a baseminiapp that helps users discover hyper-niche and mood-based music and movie recommendations by aggregating across platforms, designed for the Farcaster ecosystem.

## 🚀 Features

### Core Features
- **Niche Genre & Mood Matcher**: AI-powered recommendations for obscure genres and current moods
- **Cross-Platform Aggregation**: Unified interface for recommendations from various streaming services
- **Curated Watch/Listen Lists**: Create, save, and share personalized content lists
- **Farcaster Integration**: Native interactions within Farcaster frames with social sharing

### Technical Features
- **Token-Based Economy**: Tokenized access to premium features
- **AI-Powered Recommendations**: OpenAI integration for intelligent content discovery
- **Social Sharing**: Direct integration with Farcaster for sharing discoveries
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live token balance and recommendation updates

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Authentication**: Privy (wallet, email, Farcaster)
- **AI**: OpenAI GPT-3.5-turbo for recommendations
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe for token purchases
- **Social**: Neynar API for Farcaster integration
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibesync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys in the `.env` file:
   - `VITE_OPENAI_API_KEY`: OpenAI API key for AI recommendations
   - `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: Supabase project credentials
   - `VITE_PRIVY_APP_ID`: Privy app ID for authentication
   - `VITE_NEYNAR_API_KEY`: Neynar API key for Farcaster integration
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key for payments

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Mock Mode
The app can run in mock mode without API keys for development:
- OpenAI: Returns sample recommendations
- Supabase: Uses in-memory mock data
- Farcaster: Simulates social interactions
- Stripe: Mock token purchases
- Privy: Auto-login with mock user

### Production Setup
For production deployment:
1. Set up all required API services
2. Configure environment variables in your deployment platform
3. Set up Supabase database with proper schemas
4. Configure Stripe webhooks for payment processing
5. Set up Privy for production authentication

## 🎨 Design System

The app uses a custom design system with:
- **Colors**: Dark theme with accent colors
- **Typography**: Responsive text scales
- **Spacing**: Consistent spacing tokens
- **Components**: Reusable UI components
- **Animations**: Smooth transitions and loading states

### Design Tokens
```css
:root {
  --color-bg: hsl(230 15% 12%);
  --color-surface: hsl(230 15% 16%);
  --color-primary: hsl(240 88% 60%);
  --color-accent: hsl(180 80% 50%);
  --color-text-primary: hsl(0 0% 95%);
  --color-text-secondary: hsl(230 5% 70%);
}
```

## 🏗 Architecture

### State Management
- **Zustand Store**: Centralized state with persistence
- **User State**: Authentication and profile data
- **App State**: Current view, recommendations, preferences
- **Token State**: Balance and transaction history

### Service Layer
- **OpenAI Service**: AI recommendation generation
- **Supabase Service**: Database operations
- **Farcaster Service**: Social interactions and frame handling
- **Stripe Service**: Payment processing and token management
- **Privy Service**: Authentication and wallet management

### Component Structure
```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Service integrations
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔐 Authentication

VibeSync supports multiple authentication methods through Privy:
- **Wallet Connection**: Connect with any Web3 wallet
- **Email**: Traditional email/password authentication
- **Farcaster**: Direct Farcaster account integration

## 💰 Token Economy

### Token Costs
- AI Recommendation: 5 tokens
- Mood Analysis: 2 tokens
- Advanced Filter: 3 tokens
- Social Share: 1 token
- Playlist Generation: 10 tokens

### Token Packages
- **Basic Pack**: 100 tokens for $4.99
- **Premium Pack**: 500 tokens for $19.99 (Most Popular)
- **Unlimited**: Unlimited usage for $39.99

## 🎯 Farcaster Integration

### Frame Support
- Interactive mood selection
- Real-time recommendation display
- Direct sharing to Farcaster
- Frame metadata generation

### Social Features
- Share individual recommendations
- Share curated playlists
- Cast current mood/vibe
- Social discovery through Farcaster network

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
Ensure all production environment variables are set:
- Database connections
- API keys
- Authentication providers
- Payment processing

## 📱 Mobile Support

VibeSync is fully responsive and works on:
- Desktop browsers
- Mobile web browsers
- Progressive Web App (PWA) capabilities
- Farcaster mobile clients

## 🔍 API Documentation

### Recommendation Engine
```javascript
// Generate recommendations
const recommendations = await generateRecommendations(mood, preferences, type)

// Analyze mood from text
const mood = await analyzeMoodFromText(text)
```

### Social Integration
```javascript
// Share recommendation
const result = await shareRecommendation(recommendation, comment)

// Share playlist
const result = await sharePlaylist(playlist, comment)
```

### Token Management
```javascript
// Check token balance
const balance = await getUserTokenBalance(userId)

// Deduct tokens
const result = await deductTokens(userId, amount, action)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎵 About VibeSync

VibeSync was created to solve the problem of discovering truly personalized content that matches your current mood and niche preferences. By leveraging AI and social integration, we make content discovery effortless and social.

**Tagline**: "Discover flicks and tracks tailored to your every mood."
