import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

import { contractAddress, contractABI } from "./constants";

const getChainId = async (provider: IProvider): Promise<string> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const networkDetails = await ethersProvider.getNetwork();
    return networkDetails.chainId.toString();
  } catch (error) {
    return error as string;
  }
};

const getAccounts = async (provider: IProvider): Promise<string> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    return address;
  } catch (error) {
    return error as string;
  }
};

const getBalance = async (provider: IProvider): Promise<string> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    const balance = ethers.formatEther(await ethersProvider.getBalance(address));
    return balance;
  } catch (error) {
    return error as string;
  }
};

const sendTransaction = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const destination = "0x75Bc50a5664657c869Edc0E058d192EeEfD570eb";
    const amount = ethers.parseEther("1");
    const tx = await signer.sendTransaction({
      to: destination,
      value: amount,
    });
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    return error as string;
  }
};

const signMessage = async (provider: IProvider): Promise<string> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const originalMessage = "YOUR_MESSAGE";
    const signedMessage = await signer.signMessage(originalMessage);
    return signedMessage;
  } catch (error) {
    return error as string;
  }
};

const readFromContract = async (provider: IProvider): Promise<string> => {
  try {

    const ethersProvider = new ethers.BrowserProvider(provider);

     
    // const contract = new Contract(contractAddress, contractABI, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, ethersProvider)
  
    // Read message from smart contract

    const contractMessage = await contract.retrieve();
    console.log(contractMessage.toString());
    return contractMessage.toString();
  } catch (error) {
    return error as string;
  }

} 

const writeToContract = async (provider: IProvider, value : string): Promise<any> => {
  try {

    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

     
    // const contract = new Contract(contractAddress, contractABI, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
    // Read message from smart contract

    const contractTx = await contract.store(value);
    console.log(contractTx);
    return contractTx;
  } catch (error) {
    return error as string;
  }

} 

export default { getChainId, getAccounts, getBalance, sendTransaction, signMessage, readFromContract, writeToContract };