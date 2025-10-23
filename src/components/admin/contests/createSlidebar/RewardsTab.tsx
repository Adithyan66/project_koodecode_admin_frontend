import React from 'react';
import toast from 'react-hot-toast';
import {
  Trophy,
  Plus,
  Minus,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../../Card';

interface CoinReward {
  rank: number;
  coins: number;
}

interface RewardsTabProps {
  coinRewards: CoinReward[];
  formErrors: {
    coinRewards?: string;
  };
  addCoinReward: () => void;
  removeCoinReward: (index: number) => void;
  updateCoinReward: (index: number, field: 'rank' | 'coins', value: number) => void;
}

const RewardsTab: React.FC<RewardsTabProps> = ({
  coinRewards,
  formErrors,
  addCoinReward,
  removeCoinReward,
  updateCoinReward
}) => {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Coin Rewards</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Set up coin rewards for different ranks
        </p>
      </div>
      <div className="px-6 py-4 space-y-4">
        {coinRewards.map((reward, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Rank</span>
            </div>
            <input
              type="number"
              min="1"
              value={reward.rank}
              onChange={(e) => updateCoinReward(index, 'rank', parseInt(e.target.value) || 1)}
              className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            />
            <span className="text-gray-600 dark:text-gray-300">gets</span>
            <input
              type="number"
              min="0"
              value={reward.coins}
              onChange={(e) => updateCoinReward(index, 'coins', parseInt(e.target.value) || 0)}
              className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            />
            <span className="text-gray-600 dark:text-gray-300">coins</span>
            <button
              type="button"
              onClick={() => {
                try {
                  removeCoinReward(index);
                } catch (error: any) {
                  toast.error(error.message);
                }
              }}
              disabled={coinRewards.length <= 1}
              className={`p-1 rounded-md transition-colors ${
                coinRewards.length <= 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addCoinReward}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300"
        >
          <Plus className="h-4 w-4" />
          Add Reward Rank
        </button>

        {formErrors.coinRewards && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {formErrors.coinRewards}
          </p>
        )}
      </div>
    </Card>
  );
};

export default RewardsTab;
