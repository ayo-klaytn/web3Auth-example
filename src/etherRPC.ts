/*
 * etherRPC.ts
 * 
 * This file contains utility functions for lower-level blockchain interactions
 * using the provider object from ethers.js. It abstracts Ethereum RPC calls
 * for common operations like getting account info, sending transactions,
 * and interacting with smart contracts.
 */

import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

import { contractAddress, contractABI } from "./constants";
import { AddressLike } from "ethers";

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

const sendKaiaTx = async (provider: IProvider, destination : AddressLike, amount : any): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    const amountToSend = ethers.parseEther(amount);
        
    const tx = await signer.sendTransaction({
      to: destination,
      value: amountToSend,
    });
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    return error as string;
  }
};

const signMessage = async (provider: IProvider, originalMessage : string): Promise<string> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    const signedMessage = await signer.signMessage(originalMessage);
    return signedMessage;
  } catch (error) {
    return error as string;
  }
};

const getContractValue = async (provider: IProvider): Promise<string> => {
  try {

    const ethersProvider = new ethers.BrowserProvider(provider);

    const contract = new ethers.Contract(contractAddress, contractABI, ethersProvider)
  
    // Read message from smart contract

    const contractMessage = await contract.retrieve();
    console.log(contractMessage.toString());
    return contractMessage.toString();
  } catch (error) {
    return error as string;
  }

} 

const setContractValue = async (provider: IProvider, value : string): Promise<any> => {
  try {

    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
    // Read message from smart contract

    const contractTx = await contract.store(value);
    console.log(contractTx);
    return contractTx;
  } catch (error) {
    return error as string;
  }

} 

export default { getChainId, getAccounts, getBalance, sendKaiaTx, signMessage, getContractValue, setContractValue };