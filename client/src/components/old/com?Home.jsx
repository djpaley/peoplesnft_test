import React from "react"
import { collection, query, where, addDoc, serverTimestamp, doc, getDocs  } from "firebase/firestore";

import { useEffect, useState } from "react"
import db from "../firebase"


// import { injected } from "../wallet/Connector"
import { useWeb3React } from "@web3-react/core"
// import { ethers } from 'ethers';
import Web3 from "web3";
import Web3Modal from "web3modal";
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {WalletLink} from "walletlink";

function Home() {

    const [currentAccount, setCurrentAccount] = useState(null);

    const checkWalletIsConnected = async () => {
        const { ethereum } = window;

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account: ", account);
            setCurrentAccount(account);
        } else {
            console.log("No authorized account found");
        }
    }

    async function addNewDocument(address) {
        try {
            const docRef = await addDoc(collection(db, "whitelist"), {
                address: address,
                isCDAO: "",
                timestamp: serverTimestamp()
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    async function checkIfWhitelistExist(address) {


        console.log('checking address ',address);

    }

    const [state, setState] = useState()

    const connectWalletHandler = async () => {
        const { ethereum } = window;

        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Found an account! Address: ", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (err) {
            console.log(err)
        }

        const providerOptions = {
            /* See Provider Options Section */
            walletconnect: {
                package: WalletConnectProvider, // required
                options: {
                    infuraId: "04ff81e1b9564f8588e194b755d6cb01" // required
                }
            },
            'custom-coinbase': {
                display: {
                    logo: '/coinbase.jpg',
                    name: 'Coinbase Wallet',
                    description: 'Scan with WalletLink to connect',
                },
                options: {
                    appName: 'app', // Your app name
                    networkUrl: "https://mainnet.infura.io/v3/04ff81e1b9564f8588e194b755d6cb01",
                    chainId: 1,
                },
                package: WalletLink,
                connector: async (_, options) => {
                    const { appName, networkUrl, chainId } = options
                    const walletLink = new WalletLink({
                        appName
                    });
                    const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
                    await provider.enable();
                    return provider;
                },
            }
        };

        const web3Modal = new Web3Modal({
            // network: "rinkeby", // optional
            cacheProvider: false, // optional
            disableInjectedProvider: false,
            providerOptions, // required
        });

        const provider = await web3Modal.connect();
        console.log(provider)
        const modal = await web3Modal.toggleModal()
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        const networkId = await web3.eth.net.getId();
        console.log(address)
        checkIfWhitelistExist(address);

        setState({
            web3,
            provider,
            connected: true,
            address,
            web3Modal,
            networkId
        });
        await web3Modal.toggleModal();
        await subscribeProvider(provider)
    }

    const subscribeProvider = async (provider) => {
        if (!provider.on) {
            return;
        }
        // provider.on("close", () => this.resetApp());
        provider.on("accountsChanged", async (accounts) => {
            setState({ address: accounts[0] });
        });
        provider.on("chainChanged", async (chainId) => {
            const { web3 } = this.state;
            const networkId = await web3.eth.net.getId();
            setState({ chainId, networkId });
        });
        provider.on("networkChanged", async (networkId) => {
            const { web3 } = this.state;
            const chainId = await web3.eth.chainId();
            await this.setState({ chainId, networkId });
        });
    };
    const onConnect = async () => {
        const provider = await state.web3Modal.connect();
        await subscribeProvider(provider);
        const web3 = new Web3(provider)
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        const networkId = await web3.eth.net.getId();
        setState({
            web3,
            provider,
            connected: true,
            address,
            networkId
        });
    };


    const connectWalletButton = () => {
        return (
            <button onClick={connectWalletHandler} className="connect-btn">
                Connect Wallet
            </button>
        )
    }

    const mintNftButton = () => {
        return (
            <button className="connect-btn">
                Wallet Connected
            </button>
        )
    }

    useEffect(() => {
        checkWalletIsConnected();
    }, [])

    return (
        <div id="hero">
            <div className="hero-content text-center text-white">
                <h2 className="display">Commemorating ConstitutionDAO</h2>
                <h1 className="display">The People's NFT</h1>
                <p>
                    Presenting NFT collections to drive the spirit forward. Together we will reclaim important cultural artifacts by bringing them under the shared governance of the people. Join us!
                </p>
                <p>
                    Brought to you by original ConstitutionDAO moderators and contributors.
                </p>
                {currentAccount ? <button className="connect-btn">Connected</button> : connectWalletButton()}
                <br /><br />
                <p>
                    Stay tuned for the drop info<br></br>
                    on our Twitter and Discord
                </p>

                <div className="social">
                    <a href="https://twitter.com/peoples_NFT" title="twitter" target="_blank" rel="noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </a>
                    <a href="https://discord.gg/kpSvvmpDJd" title="discord" target="_blank" rel="noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 19.1" fill="currentColor">
                            <path d="m21.2 1.6c-1.6-0.7-3.3-1.3-5.1-1.6h-0.1c-0.2 0.4-0.5 0.9-0.6 1.3-1.9-0.3-3.8-0.3-5.7 0-0.2-0.4-0.5-0.8-0.7-1.3h-0.1c-1.7 0.3-3.4 0.8-5.1 1.6-3.2 4.8-4.1 9.6-3.7 14.2v0.1c1.9 1.4 4 2.5 6.2 3.2h0.1c0.5-0.7 0.9-1.3 1.3-2.1v-0.1c-0.7-0.3-1.3-0.6-1.9-0.9v-0.1c0.1-0.1 0.3-0.2 0.4-0.3h0.1c4.1 1.9 8.5 1.9 12.6 0h0.1c0.1 0.1 0.3 0.2 0.4 0.3v0.1c-0.6 0.4-1.3 0.7-2 0.9v0.1c0.4 0.7 0.8 1.4 1.3 2.1h0.1c2.2-0.7 4.4-1.8 6.3-3.2v-0.1c0.3-5.4-1.1-10-3.9-14.2zm-12.8 11.4c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5c1.3 0 2.3 1.1 2.2 2.5 0 1.4-1 2.5-2.2 2.5zm8.3 0c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5c1.3 0 2.3 1.1 2.2 2.5 0 1.4-1 2.5-2.2 2.5z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Home;
