import { CHAIN_NAMESPACES, IProvider, IAdapter, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";

import "./App.css";

import { useEffect, useState } from "react";
import RPC from "./etherRPC";
import { truncateAddress } from "./utils";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x3e9", // Kairos Testnet
  rpcTarget: "https://public-en-kairos.node.kaia.io",
  displayName: "Kairos Testnet",
  blockExplorerUrl: "https://kairos.kaiascan.io",
  ticker: "KLAY",
  tickerName: "KLAY",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
}

const web3auth = new Web3Auth(web3AuthOptions);

const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });
adapters.forEach((adapter: IAdapter<unknown>) => {
  web3auth.configureAdapter(adapter);
});

interface UserInfo {
  email: string;
  name: string;
  profileImage: string;
  [key: string]: unknown;
}

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [signedMessage, setSignedMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [contractMessage, setContractMessage] = useState<string>("");
  const [contractTxHash, setContractTxHash] = useState<string>("");


  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
          await updateUserInfo();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const updateUserInfo = async () => {
    if (web3auth.provider) {
      const user = await web3auth.getUserInfo();
      // @ts-ignore
      setUserInfo(user);
      const accounts = await RPC.getAccounts(web3auth.provider);
      setAddress(accounts);
      const balance = await RPC.getBalance(web3auth.provider);
      setBalance(balance);
    }
  };

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
      await updateUserInfo();
    }
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    // @ts-ignore
    setUserInfo(user);
    console.log("User Info:", user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    setAddress("");
    setBalance("");
    setUserInfo(null);
    setSignedMessage("");
    setTxHash("");
    console.log("Logged out");
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    setAddress(address);
    console.log("Address:", address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    setBalance(balance);
    console.log("Balance:", balance);
  };

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    
    const originalMessage = "YOUR_MESSAGE";

    const signedMessage = await RPC.signMessage(provider, originalMessage);
    setSignedMessage(signedMessage);
    console.log("Signed Message:", signedMessage);
  };

  const sendKaiaTx = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    console.log("Sending Transaction...");

    const destination = "0x75Bc50a5664657c869Edc0E058d192EeEfD570eb";
    const amount = "0.1";    
    
    const receipt = await RPC.sendKaiaTx(provider,destination, amount);
    setTxHash(receipt.hash);
    console.log("Transaction Receipt:", receipt);
  };

  const getContractValue = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    console.log("Reading from Contract...");

    const message = await RPC.getContractValue(provider);
    setContractMessage(message);
    console.log("Read Message Receipt:", message);
  }

  const setContractValue = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    console.log("Writing to Contract...");

    const value = "100";

    const tx = await RPC.setContractValue(provider, value);
    setContractTxHash(tx.hash);

    console.log("Transaction Receipt:", tx);
  }

  const loggedInView = (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={getUserInfo} className="btn-primary">
          Get User Info
        </button>
        <button onClick={getAccounts} className="btn-primary">
          Get Accounts
        </button>
        <button onClick={getBalance} className="btn-primary">
          Get Balance
        </button>
        <button onClick={signMessage} className="btn-primary">
          Sign Message
        </button>
        <button onClick={sendKaiaTx} className="btn-primary">
          Send Transaction
        </button>
        <button onClick={getContractValue} className="btn-primary">
          Read Contract Message
        </button>
        <button onClick={setContractValue} className="btn-primary">
          Write to Contract Message
        </button>
        <button onClick={logout} className="btn-secondary">
          Log Out
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">User Info:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {userInfo ? JSON.stringify(userInfo, null, 2) : "Not available"}
          </pre>
        </div>
        <div>
          <h2 className="font-semibold text-wrap text-center text-sm">Address: <span className="font-normal">{`${truncateAddress(address)}` || "Not available"}</span></h2>
        </div>
        <div>
          <h2 className="text-wrap text-center text-sm font-semibold ">Balance: <span className="font-normal">{balance || "Not available"}</span></h2>
        </div>
        {signedMessage && (
          <div>
            <h2 className="text-wrap text-center text-sm font-semibold">Signed Message: <span className="font-normal">{signedMessage}</span></h2>
          </div>
        )}
        {txHash && (
          <div>
            <h2 className="text-wrap text-center text-sm font-semibold">
              Transaction Hash:{" "}
              <a 
                href={`${chainConfig.blockExplorerUrl}/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-center text-sm text-pretty text-blue-600 hover:text-blue-800 underline"
              >
                {txHash}
              </a>
            </h2>
          </div>
        )}
        {contractMessage && (
          <div>
            <h2 className="text-wrap text-center text-sm font-semibold">Read Message: <span className="font-normal">{contractMessage}</span></h2>
          </div>
        )}
        {contractTxHash && (
          <div>
            <h2 className="text-wrap text-center text-sm font-semibold">Contract Tx Hash: <span className="font-normal">{contractTxHash}</span></h2>
          </div>
        )}
      </div>
    </div>
  );
  
  const unloggedInView = (
    <div className="flex justify-center items-center h-screen">
      <button onClick={login} className="btn-primary text-xl">
        Login
      </button>
    </div>
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            <a 
              target="_blank" 
              href="https://web3auth.io/docs/sdk/pnp/web/modal" 
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Web3Auth
            </a>
            {" "}& Kaia <br /> React Quick Start
          </h1>
  
          <div className="mt-8">
            {loggedIn ? loggedInView : unloggedInView}
          </div>
  
          <footer className="mt-8 text-center text-gray-500">
            <a
              href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/quick-starts/react-vite-modal-quick-start"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 underline"
            >
              Source code
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;