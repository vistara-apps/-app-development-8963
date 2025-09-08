import { useState } from 'react'
import { Coins, Plus, Info } from 'lucide-react'
import useAppStore from '../stores/useAppStore'
import TokenPurchaseModal from './TokenPurchaseModal'

const TokenBalance = ({ showPurchaseButton = true, compact = false }) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const { tokenBalance, user } = useAppStore()

  const getBalanceColor = () => {
    if (tokenBalance >= 100) return 'text-green-400'
    if (tokenBalance >= 20) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getBalanceStatus = () => {
    if (tokenBalance >= 100) return 'Plenty of tokens'
    if (tokenBalance >= 20) return 'Running low'
    return 'Very low tokens'
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Coins size={16} className={getBalanceColor()} />
          <span className={`font-medium ${getBalanceColor()}`}>
            {tokenBalance}
          </span>
        </div>
        {showPurchaseButton && tokenBalance < 20 && (
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="p-1 bg-accent text-black rounded hover:bg-accent/90 transition-colors"
          >
            <Plus size={14} />
          </button>
        )}
        {showPurchaseModal && (
          <TokenPurchaseModal
            isOpen={showPurchaseModal}
            onClose={() => setShowPurchaseModal(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Coins className={getBalanceColor()} size={20} />
          <h3 className="font-semibold">Token Balance</h3>
        </div>
        <div className="flex items-center gap-1">
          <Info size={14} className="text-text-secondary" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Available Tokens</span>
          <span className={`text-2xl font-bold ${getBalanceColor()}`}>
            {tokenBalance}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Status</span>
          <span className={getBalanceColor()}>
            {getBalanceStatus()}
          </span>
        </div>

        {/* Token usage info */}
        <div className="border-t border-gray-700 pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">AI Recommendation</span>
            <span>5 tokens</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Mood Analysis</span>
            <span>2 tokens</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Social Share</span>
            <span>1 token</span>
          </div>
        </div>

        {showPurchaseButton && (
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="w-full mt-4 bg-accent text-black py-2 px-4 rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            <Plus size={16} className="inline mr-2" />
            Buy More Tokens
          </button>
        )}
      </div>

      {showPurchaseModal && (
        <TokenPurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}
    </div>
  )
}

export default TokenBalance
