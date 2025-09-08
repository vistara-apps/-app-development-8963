import { useState } from 'react'
import { X, Check, Coins, Star } from 'lucide-react'
import { TOKEN_PACKAGES, createPaymentIntent, getStripe } from '../lib/stripe'
import useAppStore from '../stores/useAppStore'
import toast from 'react-hot-toast'

const TokenPurchaseModal = ({ isOpen, onClose }) => {
  const [selectedPackage, setSelectedPackage] = useState('premium')
  const [loading, setLoading] = useState(false)
  const { user, addTokens } = useAppStore()

  if (!isOpen) return null

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please log in to purchase tokens')
      return
    }

    setLoading(true)

    try {
      const selectedPkg = TOKEN_PACKAGES.find(pkg => pkg.id === selectedPackage)
      
      // Create payment intent
      const { clientSecret } = await createPaymentIntent(selectedPackage)
      
      if (clientSecret === 'mock_client_secret') {
        // Mock purchase for development
        setTimeout(() => {
          addTokens(selectedPkg.tokens === -1 ? 1000 : selectedPkg.tokens)
          toast.success(`Successfully purchased ${selectedPkg.name}!`)
          onClose()
          setLoading(false)
        }, 2000)
        return
      }

      // Real Stripe payment flow
      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Stripe not initialized')
      }

      // Redirect to Stripe checkout or handle payment
      // This would typically redirect to a checkout page or use Stripe Elements
      toast.success('Redirecting to payment...')
      
    } catch (error) {
      console.error('Purchase error:', error)
      toast.error('Failed to process purchase. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Coins className="text-accent" size={24} />
            <h2 className="text-xl font-bold">Purchase Tokens</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-text-secondary mb-6">
            Choose a token package to unlock AI-powered recommendations and premium features.
          </p>

          {/* Package Selection */}
          <div className="grid gap-4 mb-6">
            {TOKEN_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-700 hover:border-gray-600'
                } ${pkg.popular ? 'ring-2 ring-accent/50' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-4 bg-accent text-black px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <Star size={12} />
                    Most Popular
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{pkg.name}</h3>
                    <p className="text-text-secondary text-sm">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ${pkg.price}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {pkg.tokens === -1 ? 'Unlimited' : `${pkg.tokens} tokens`}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedPackage === pkg.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                      <Check size={12} className="text-black" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Purchase Button */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-accent text-black rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                `Purchase ${TOKEN_PACKAGES.find(p => p.id === selectedPackage)?.name}`
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-text-secondary">
              🔒 Secure payment powered by Stripe. Your payment information is encrypted and secure.
              Tokens are added to your account immediately after successful payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenPurchaseModal
