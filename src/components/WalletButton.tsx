import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletButton = () => {
  return (
    <div className="wallet-button-wrapper">
      <WalletMultiButton className="wallet-button" />
      <style>{`
        .wallet-button {
          background-color: #7B3FE4 !important;
          border-radius: 9999px !important;
          transition: all 0.2s !important;
        }
        .wallet-button:hover {
          background-color: #6935c4 !important;
        }
      `}</style>
    </div>
  );
};