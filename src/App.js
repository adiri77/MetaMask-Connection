import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { injected } from './components/wallet/Connectors';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #111;
  color: #ddd;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const Container = styled.div`
  background-color: #222;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
`;

const StatusSection = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const NetworkSection = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-family: din-round, sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.8px;
  line-height: 20px;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 13px 16px;
  text-align: center;
  text-transform: uppercase;
  touch-action: manipulation;
  transform: translateZ(0);
  transition: filter 0.2s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  position: relative;

  &:after {
    background-clip: padding-box;
    border: solid transparent;
    border-radius: 16px;
    border-width: 0 0 4px;
    bottom: -4px;
    content: '';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.1);
    -webkit-filter: brightness(1.1);
  }

  &:disabled {
    cursor: auto;
  }
`;

const ConnectWalletButton = styled(Button)`
  background-color: #1899d6;

  &:after {
    background-color: #1cb0f6;
  }
`;

const DisconnectWalletButton = styled(Button)`
  background-color: #d62e18;

  &:after {
    background-color: #f6391c;
  }
`;

const InfoSection = styled.div`
  border-top: 1px solid #444;
  padding-top: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #444;
  overflow: hidden;
`;

const InfoText = styled.p`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AccountInfo = styled(InfoText)`
 margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChainIdInfo = styled(InfoText)`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

function App() {
  const { activate, account, active, chainId, library } = useWeb3React();
  const [balance, setBalance] = useState(null);
  const ETHERSCAN_API_KEY = 'HWFQDMF7FBIFJQ2KEJDRDA2HJ3G1SBCBXQ';

  useEffect(() => {
    if (active && account) {
      fetchBalanceFromEtherscan();
    }
  }, [active, account]);

  const fetchBalanceFromEtherscan = async () => {
    if (account) {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=balance&address=${account}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
      );
      const balanceInWei = response.data.result;
      setBalance(library.utils.fromWei(balanceInWei, 'ether'));
    }
  };

  const connectMetamask = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error(error);
    }
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1:
        return 'Mainnet';
      case 3:
        return 'Ropsten';
      case 4:
        return 'Rinkeby';
      case 5:
        return 'Goerli';
      case 42:
        return 'Kovan';
      case 11155111:
        return 'Sepolia';
      default:
        return 'Unknown Network';
    }
  };

  return (
    <AppContainer>
      <Container>
        <StatusSection>
          <p>Status: {active ? 'Connected' : 'Disconnected'}</p>
        </StatusSection>
        <NetworkSection>
          {active ? (
            <DisconnectWalletButton>{getNetworkName(chainId)}</DisconnectWalletButton>
          ) : (
            <ConnectWalletButton onClick={connectMetamask}>Connect Wallet</ConnectWalletButton>
          )}
        </NetworkSection>
        {active && (
          <InfoSection>
            <InfoRow>
              <InfoText>Token Name</InfoText>
              <InfoText>{getNetworkName(chainId)}</InfoText>
            </InfoRow>
            <InfoRow>
              <InfoText>Account</InfoText>
              <AccountInfo>{account}</AccountInfo>
            </InfoRow>
            <InfoRow>
              <InfoText>Balance</InfoText>
              <InfoText>{balance} ETH</InfoText>
            </InfoRow>
            <InfoRow>
              <InfoText>Chain ID</InfoText>
              <ChainIdInfo>{chainId}</ChainIdInfo>
            </InfoRow>
          </InfoSection>
        )}
      </Container>
    </AppContainer>
  );
}

export default App;
