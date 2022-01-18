import React, { useEffect, useState } from 'react';
import { collection, query, where, addDoc, serverTimestamp, doc, getDocs  } from "firebase/firestore";
import db from "../firebase"
import bgImage from '../hero-bg.jpg';
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {WalletLink} from "walletlink";

function Home() {
    const WalletModel = () => {
        const [loading, setLoading] = useState(false);
        return {
            get web3Loading() {
                return loading
            },
            async getweb3() {
                setLoading(true);
                let web3Modal;
                let provider;
                let web3;
                let providerOptions;
                providerOptions = {
                    metamask: {
                        id: "injected",
                        name: "MetaMask",
                        type: "injected",
                        check: "isMetaMask"
                    },
                    walletconnect: {
                        package: WalletConnectProvider, // required
                        options: {
                            infuraId: "04ff81e1b9564f8588e194b755d6cb01", // required
                            qrcodeModalOptions: {
                                mobileLinks: [
                                    "metamask",
                                ]
                            }
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
                web3Modal = new Web3Modal({
                    network: "rinkeby",
                    cacheProvider: true,
                    providerOptions
                });
                provider = await web3Modal.connect();
                provider.on('error', e => console.error('WS Error', e));
                provider.on('end', e => console.error('WS End', e));

                // Subscribe to provider connection
                provider.on("connect", (info: { chainId: number }) => {
                    console.log(info);
                });

                // Subscribe to provider disconnection
                provider.on("disconnect", (error: { code: number; message: string }) => {
                    console.log(error);
                });

                web3 = new Web3(provider);
                setLoading(false);
                return web3;
            },
        }
    }

    const {web3Loading, getweb3} = WalletModel();
    const [myWeb3, setMyWeb3] = useState();
    async function connectWallet() {
        await getweb3().then((response) => {
            setMyWeb3(response);
            response.eth.getAccounts().then((result) => (
                    console.log (result)
                )
            )
        });
    };



    // const [currentAccount, setCurrentAccount] = useState(null);
    //
    // const checkWalletIsConnected = async () => {
    //     const { ethereum } = window;
    //
    //     const accounts = await ethereum.request({ method: 'eth_accounts' });
    //
    //     if (accounts.length !== 0) {
    //         const account = accounts[0];
    //         console.log("Found an authorized account: ", account);
    //         setCurrentAccount(account);
    //     } else {
    //         console.log("No authorized account found");
    //     }
    // }
    //
    // async function addNewDocument(address) {
    //     console.log('you are adding');
    //     try {
    //         const docRef = await addDoc(collection(db, "whitelists"), {
    //             address: address,
    //             isCDAO: "",
    //             timestamp: serverTimestamp()
    //         });
    //         console.log("Document written with ID: ", docRef.id);
    //     } catch (e) {
    //         console.error("Error adding document: ", e);
    //     }
    // }
    //
    // async function checkIfWhitelistExist(address) {
    //     console.log('testing whitelist '+address);
    //     const q = query(collection(db, "whitelists"), where("address", "==", address));
    //     const querySnapshot = await getDocs(q);
    //     console.log('query snap' +querySnapshot);
    //     querySnapshot.forEach((doc) => {
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, " => ", doc.data());
    //         console.log('found this here '+doc.id);
    //         if(doc.id) {
    //             console.log('already inserted');
    //         } else {
    //             addNewDocument(address);
    //         }
    //     });
    //
    //
    // }
    //
    // const [state, setState] = useState()
    //
    // const connectWalletHandler = async () => {
    //
    //     const providerOptions = {
    //
    //         /* See Provider Options Section */
    //         walletconnect: {
    //             package: WalletConnectProvider, // required
    //             options: {
    //                 infuraId: "04ff81e1b9564f8588e194b755d6cb01" // required
    //             }
    //         },
    //         'custom-coinbase': {
    //             display: {
    //                 logo: '/coinbase.jpg',
    //                 name: 'Coinbase Wallet',
    //                 description: 'Scan with WalletLink to connect',
    //             },
    //             options: {
    //                 appName: 'app', // Your app name
    //                 networkUrl: "https://mainnet.infura.io/v3/04ff81e1b9564f8588e194b755d6cb01",
    //                 chainId: 1,
    //             },
    //             package: WalletLink,
    //             connector: async (_, options) => {
    //                 const { appName, networkUrl, chainId } = options
    //                 const walletLink = new WalletLink({
    //                     appName
    //                 });
    //                 const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
    //                 await provider.enable();
    //                 return provider;
    //             },
    //         }
    //     };
    //
    //
    //     const web3Modal = new Web3Modal({
    //         // network: "rinkeby", // optional
    //         cacheProvider: false, // optional
    //         disableInjectedProvider: false,
    //         providerOptions, // required
    //
    //
    //     });
    //
    //
    //     const provider = await web3Modal.connect();
    //     console.log(provider)
    //     const modal = await web3Modal.toggleModal()
    //     const web3 = new Web3(provider);
    //     const accounts = await web3.eth.getAccounts();
    //     const address = accounts[0];
    //     const networkId = await web3.eth.net.getId();
    //     console.log(address)
    //     checkIfWhitelistExist(address);
    //
    //     setState({
    //         web3,
    //         provider,
    //         connected: true,
    //         address,
    //         web3Modal,
    //         networkId
    //     });
    //     await web3Modal.toggleModal();
    //     await subscribeProvider(provider)
    // }
    //
    // const subscribeProvider = async (provider) => {
    //     if (!provider.on) {
    //         return;
    //     }
    //     // provider.on("close", () => this.resetApp());
    //     provider.on("accountsChanged", async (accounts) => {
    //         setState({ address: accounts[0] });
    //     });
    //     provider.on("chainChanged", async (chainId) => {
    //         const { web3 } = this.state;
    //         const networkId = await web3.eth.net.getId();
    //         setState({ chainId, networkId });
    //     });
    //     provider.on("networkChanged", async (networkId) => {
    //         const { web3 } = this.state;
    //         const chainId = await web3.eth.chainId();
    //         await this.setState({ chainId, networkId });
    //     });
    // };
    // const onConnect = async () => {
    //     const provider = await state.web3Modal.connect();
    //     await subscribeProvider(provider);
    //     const web3 = new Web3(provider)
    //     const accounts = await web3.eth.getAccounts();
    //     const address = accounts[0];
    //     const networkId = await web3.eth.net.getId();
    //     setState({
    //         web3,
    //         provider,
    //         connected: true,
    //         address,
    //         networkId
    //     });
    // };
    //
    //
    // const connectWalletButton = () => {
    //     return (
    //         <button onClick={connectWalletHandler} className="connect-btn">
    //             Connect Wallet
    //         </button>
    //     )
    // }
    //
    // const mintNftButton = () => {
    //     return (
    //         <button className="connect-btn">
    //             Wallet Connected
    //         </button>
    //     )
    // }
    //
    useEffect(() => {

        //checkWalletIsConnected();
    }, [])

    return (
        <div id="home">
            <section className="hero-content d-flex min-vh-100" style={{
                    backgroundImage: 'url('+bgImage+')'}}>
                <div className="container align-self-center">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8 col-xl-6 text-center">
                            <h2 className="display">Commemorating ConstitutionDAO</h2>
                            <h1 className="display">The People's NFT</h1>
                            {web3Loading ? <button className="btn btn-primary btn-lg" disabled>Loading ... </button> : <button className="btn btn-primary btn-lg" onClick={connectWallet}>Get Whitelisted</button>}
                        </div>
                    </div>
                </div>
            </section>
            <section className="container py-5">
                <div className="col-md-9">
                    <h2 className="font-large mb-4">Mission</h2>
                    <p className="lead">Our call to action based on Mount Rushmore: Master carver Gutzon Borglum created Mount Rushmore to commemorate America’s first 150 years as a free country.</p>
                </div>
            </section>
            <section className="quotes">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col text-white text-center py-5 px-3 bor-right">
                            Commemorate the founding, growth, preservation, and development to the United States of America.
                        </div>
                        <div className="col text-white text-center py-5 px-3 bor-left">
                            Commemorate the founding, growth, preservation, and development to [web3].
                        </div>
                    </div>
                </div>
            </section>
            <section className="container py-5">
                <div className="row">
                    <div className="col-lg-7">
                        <h2>Presenting NFT collections to drive the spirit forward.</h2>
                        <p>Together we will reclaim important cultural artifacts by bringing them under the shared governance of the people. Join us!</p>
                        <p>Brought to you by original ConstitutionDAO moderators and contributors.</p>
                    </div>
                    <div className="col-lg-5">
                        <img
                            className="img-fluid rounded mb-4 mb-lg-0"
                            src="http://placehold.it/900x400"
                            alt=""
                        />
                    </div>
                </div>
            </section>
            <section className="join py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-auto display">Join Our Community</div>
                        <div className="col-auto">
                            <a href="https://twitter.com/peoples_NFT" title="twitter" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#4C9FEC"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                <strong>Twitter</strong>
                            </a>
                        </div>
                        <div className="col-auto">
                            <a href="https://discord.gg/kpSvvmpDJd" title="discord" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg"  width="50" height="38" viewBox="0 0 25 19.1" fill="#7688D5">
                                    <path d="m21.2 1.6c-1.6-0.7-3.3-1.3-5.1-1.6h-0.1c-0.2 0.4-0.5 0.9-0.6 1.3-1.9-0.3-3.8-0.3-5.7 0-0.2-0.4-0.5-0.8-0.7-1.3h-0.1c-1.7 0.3-3.4 0.8-5.1 1.6-3.2 4.8-4.1 9.6-3.7 14.2v0.1c1.9 1.4 4 2.5 6.2 3.2h0.1c0.5-0.7 0.9-1.3 1.3-2.1v-0.1c-0.7-0.3-1.3-0.6-1.9-0.9v-0.1c0.1-0.1 0.3-0.2 0.4-0.3h0.1c4.1 1.9 8.5 1.9 12.6 0h0.1c0.1 0.1 0.3 0.2 0.4 0.3v0.1c-0.6 0.4-1.3 0.7-2 0.9v0.1c0.4 0.7 0.8 1.4 1.3 2.1h0.1c2.2-0.7 4.4-1.8 6.3-3.2v-0.1c0.3-5.4-1.1-10-3.9-14.2zm-12.8 11.4c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5c1.3 0 2.3 1.1 2.2 2.5 0 1.4-1 2.5-2.2 2.5zm8.3 0c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5c1.3 0 2.3 1.1 2.2 2.5 0 1.4-1 2.5-2.2 2.5z"/>
                                </svg>
                                <strong>Discord</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <p id="roadmap" className="pt-5"></p>
            <section className="pb-5">
                <div className="container">
                    <h2 className="mb-5">Roadmap</h2>
                    <ul className="timeline col-md-9">
                        <li>
                            <img alt="Phase 1: Mint" src="./images/phase1.png" />
                            <p className="phase">Phase 1</p>
                            <p><strong>Mint</strong> an NFT that commemorates the ConstitutionDAO effort & onboards minters to lead the future of the project.</p>
                        </li>
                        <li>
                            <img alt="Phase 2: Vote" src="./images/phase2.png" />
                            <p className="phase">Phase 2</p>
                            <p><strong>Vote</strong> on a historically significant artifact by NFT-holding contributors.</p>
                        </li>
                        <li>
                            <img alt="Phase 3: Purhcase" src="./images/phase3.png" />
                            <p className="phase">Phase 3</p>
                            <p><strong>Purchase</strong> artifacts in the physical world.</p>
                        </li>
                        <li>
                            <img alt="Phase 4: Unveil" src="./images/phase4.png" />
                            <p className="phase">Phase 4</p>
                            <p><strong>Unveil</strong> Web3’s first public exhibit to the world that educates the audience on the artifacts history and about the web3 ecosystem.</p>
                        </li>
                        <li>
                            <img alt="Phase 5: Grow" src="./images/phase5.png" />
                            <p className="phase">Phase 5</p>
                            <p><strong>Grow</strong> the contributor community & acquire more artifacts to expand the educational mission.</p>
                        </li>
                        <li>
                            <img alt="Phase 6: Enable" src="./images/phase6.png" />
                            <p className="phase">Phase 6</p>
                            <p><strong>Enable</strong> priority exhibit access for NFT contributors and host public events to grow community awareness.</p>
                        </li>
                    </ul>
                </div>
            </section>
        </div>

    );
}

export default Home;
