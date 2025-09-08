import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('Stripe publishable key not found. Payment features will be disabled.')
}

let stripePromise = null

if (STRIPE_PUBLISHABLE_KEY) {
  stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
}

// Token pricing tiers
export const TOKEN_PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Pack',
    tokens: 100,
    price: 4.99,
    description: 'Perfect for casual discovery',
    features: ['100 AI recommendations', 'Basic mood matching', 'Save up to 5 lists']
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    tokens: 500,
    price: 19.99,
    description: 'For the serious music & movie lover',
    features: ['500 AI recommendations', 'Advanced mood analysis', 'Unlimited saved lists', 'Social sharing'],
    popular: true
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    tokens: -1, // -1 represents unlimited
    price: 39.99,
    description: 'All features, unlimited usage',
    features: ['Unlimited AI recommendations', 'Premium mood analysis', 'Unlimited saved lists', 'Priority support', 'Early access to new features']
  }
]

// Token costs for different actions
export const TOKEN_COSTS = {
  AI_RECOMMENDATION: 5,
  MOOD_ANALYSIS: 2,
  ADVANCED_FILTER: 3,
  SOCIAL_SHARE: 1,
  PLAYLIST_GENERATION: 10
}

export const getStripe = async () => {
  if (!stripePromise) {
    console.warn('Stripe not initialized. Payment features disabled.')
    return null
  }
  return await stripePromise
}

export const createPaymentIntent = async (packageId) => {
  const selectedPackage = TOKEN_PACKAGES.find(pkg => pkg.id === packageId)
  
  if (!selectedPackage) {
    throw new Error('Invalid package selected')
  }

  // In a real app, this would call your backend API
  // For now, we'll simulate the payment intent creation
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.log('Mock payment intent created for:', selectedPackage.name)
    return {
      clientSecret: 'mock_client_secret',
      amount: selectedPackage.price * 100,
      currency: 'usd'
    }
  }

  try {
    // This would typically be a call to your backend
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        packageId,
        amount: selectedPackage.price * 100,
        currency: 'usd'
      }),
    })

    const { clientSecret } = await response.json()
    return { clientSecret, amount: selectedPackage.price * 100, currency: 'usd' }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

export const processPayment = async (stripe, elements, clientSecret) => {
  if (!stripe || !elements) {
    throw new Error('Stripe not properly initialized')
  }

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.origin}/payment-success`,
    },
  })

  if (error) {
    throw error
  }

  return paymentIntent
}

// Mock token management for development
let mockTokenBalance = 50 // Start with 50 free tokens

export const getUserTokenBalance = async (userId) => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.log('Using mock token balance:', mockTokenBalance)
    return mockTokenBalance
  }

  // In a real app, this would fetch from your backend/database
  try {
    const response = await fetch(`/api/users/${userId}/tokens`)
    const data = await response.json()
    return data.balance
  } catch (error) {
    console.error('Error fetching token balance:', error)
    return 0
  }
}

export const deductTokens = async (userId, amount, action) => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.log(`Mock: Deducting ${amount} tokens for ${action}`)
    mockTokenBalance = Math.max(0, mockTokenBalance - amount)
    return {
      success: true,
      newBalance: mockTokenBalance,
      deducted: amount
    }
  }

  try {
    const response = await fetch(`/api/users/${userId}/tokens/deduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, action }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deducting tokens:', error)
    throw error
  }
}

export const addTokens = async (userId, amount, source = 'purchase') => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.log(`Mock: Adding ${amount} tokens from ${source}`)
    mockTokenBalance += amount
    return {
      success: true,
      newBalance: mockTokenBalance,
      added: amount
    }
  }

  try {
    const response = await fetch(`/api/users/${userId}/tokens/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, source }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error adding tokens:', error)
    throw error
  }
}

export const canAffordAction = async (userId, action) => {
  const balance = await getUserTokenBalance(userId)
  const cost = TOKEN_COSTS[action] || 0
  
  return {
    canAfford: balance >= cost,
    balance,
    cost,
    shortfall: Math.max(0, cost - balance)
  }
}
