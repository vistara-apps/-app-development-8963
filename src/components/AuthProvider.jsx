import { PrivyProvider } from '@privy-io/react-auth'
import { useEffect } from 'react'
import useAppStore from '../stores/useAppStore'

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID

const AuthProvider = ({ children }) => {
  const { setUser, resetUser } = useAppStore()

  if (!PRIVY_APP_ID) {
    console.warn('Privy App ID not found. Authentication will be disabled.')
    
    // Mock authentication for development
    return (
      <MockAuthProvider setUser={setUser} resetUser={resetUser}>
        {children}
      </MockAuthProvider>
    )
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#00D4AA',
          logo: '/vibesync-logo.png'
        },
        loginMethods: ['wallet', 'email', 'farcaster'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        },
        farcaster: {
          enabled: true
        }
      }}
      onSuccess={(user) => {
        console.log('User authenticated:', user)
        setUser({
          id: user.id,
          wallet: user.wallet?.address,
          email: user.email?.address,
          farcaster: user.farcaster,
          createdAt: user.createdAt
        })
      }}
      onError={(error) => {
        console.error('Authentication error:', error)
        resetUser()
      }}
    >
      {children}
    </PrivyProvider>
  )
}

// Mock authentication provider for development
const MockAuthProvider = ({ children, setUser, resetUser }) => {
  useEffect(() => {
    // Simulate a logged-in user for development
    const mockUser = {
      id: 'mock-user-123',
      wallet: '0x1234567890123456789012345678901234567890',
      email: 'user@vibesync.app',
      farcaster: {
        fid: 12345,
        username: 'vibesync_user',
        displayName: 'VibeSync User'
      },
      createdAt: new Date().toISOString()
    }

    // Auto-login mock user after a short delay
    setTimeout(() => {
      setUser(mockUser)
      console.log('Mock user authenticated:', mockUser)
    }, 1000)
  }, [setUser])

  return <>{children}</>
}

export default AuthProvider
