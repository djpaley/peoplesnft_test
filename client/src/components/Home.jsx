import React, { useEffect, useState } from 'react';
import bgImage from '../hero-bg.jpg';
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {WalletLink} from "walletlink";
import $ from 'jquery';
import axios from "axios";

function Home() {
    const [post, setPost] = React.useState(null);

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
                    // metamask: {
                    //     id: "injected",
                    //     name: "MetaMask",
                    //     type: "injected",
                    //     check: "isMetaMask"
                    // },
                    walletconnect: {
                        package: WalletConnectProvider, // required
                        options: {
                            infuraId: "04ff81e1b9564f8588e194b755d6cb01", // required
                            // qrcodeModalOptions: {
                            //     mobileLinks: [
                            //         "metamask",
                            //     ]
                            // }
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
                    // network: "rinkeby",
                    cacheProvider: false,
                    providerOptions
                });
                //installMetamask()
                provider = await web3Modal.connect();
                provider.on('error', e => console.error('WS Error', e));
                provider.on('end', e => console.error('WS End', e));

                // Subscribe to provider connection
                provider.on("connect", (info: { chainId: number }) => {
                    console.log('info is here '+info);
                });

                // Subscribe to provider disconnection
                provider.on("disconnect", (error: { code: number; message: string }) => {
                    console.log('error is here '+error);
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
            setMyWeb3('response is here '+response);
            response.eth.getAccounts().then((result) => (
                    console.log ('result is here '+result),
                    verifyByWallet(result),
                    // addNewWhitelist(result),
                    window.location.reload(false)

                )
            )
        });
    };

    function installMetamask() {
        if (!(window.web3 || window.ethereum)) {
            if ($('#installMetaMask').length < 1)
                $('.web3modal-modal-card').prepend('<div id="installMetaMask" class="sc-eCImPb bElhDP web3modal-provider-wrapper"><a style="text-decoration: none" href="https://metamask.io/" target="_blank" class="sc-hKwDye hKhOIm web3modal-provider-container"><div class="sc-bdvvtL fqonLZ web3modal-provider-icon"><img src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM1NSIgdmlld0JveD0iMCAwIDM5NyAzNTUiIHdpZHRoPSIzOTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMSAtMSkiPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTIuMDA0NzE3IDEzLjgxMDE5OHYtMTguMDU5NDlsNC4yNDUyODMtNC4yNDkyOTJoMjkuNzE2OTgydjIxLjI0NjQ1OSAxNC44NzI1MjNoLTMxLjgzOTYyNGwtMzkuMjY4ODY4LTE2Ljk5NzE2OXoiIGZpbGw9IiNjZGJkYjIiLz48cGF0aCBkPSJtMTk5LjUyODMwNSAzMjcuMTk1NDcyIDUwLjk0MzM5NyAxMy44MTAxOTh2LTE4LjA1OTQ5bDQuMjQ1MjgzLTQuMjQ5MjkyaDI5LjcxNjk4MXYyMS4yNDY0NTkgMTQuODcyNTIzaC0zMS44Mzk2MjNsLTM5LjI2ODg2OC0xNi45OTcxNjl6IiBmaWxsPSIjY2RiZGIyIiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSA0ODMuOTYyMjcgMCkiLz48cGF0aCBkPSJtMTcwLjg3MjY0NCAyODcuODg5NTIzLTQuMjQ1MjgzIDM1LjA1NjY1NyA1LjMwNjYwNC00LjI0OTI5Mmg1NS4xODg2OGw2LjM2NzkyNSA0LjI0OTI5Mi00LjI0NTI4NC0zNS4wNTY2NTctOC40OTA1NjUtNS4zMTE2MTUtNDIuNDUyODMyIDEuMDYyMzIzeiIgZmlsbD0iIzM5MzkzOSIvPjxwYXRoIGQ9Im0xNDIuMjE2OTg0IDUwLjk5MTUwMjIgMjUuNDcxNjk4IDU5LjQ5MDA4NTggMTEuNjc0NTI4IDE3My4xNTg2NDNoNDEuMzkxNTExbDEyLjczNTg0OS0xNzMuMTU4NjQzIDIzLjM0OTA1Ni01OS40OTAwODU4eiIgZmlsbD0iI2Y4OWMzNSIvPjxwYXRoIGQ9Im0zMC43NzgzMDIzIDE4MS42NTcyMjYtMjkuNzE2OTgxNTMgODYuMDQ4MTYxIDc0LjI5MjQ1MzkzLTQuMjQ5MjkzaDQ3Ljc1OTQzNDN2LTM3LjE4MTMwM2wtMi4xMjI2NDEtNzYuNDg3MjUzLTEwLjYxMzIwOCA4LjQ5ODU4M3oiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtODcuMDI4MzAzMiAxOTEuMjE4MTM0IDg3LjAyODMwMjggMi4xMjQ2NDYtOS41NTE4ODYgNDQuNjE3NTYzLTQxLjM5MTUxMS0xMC42MjMyMjl6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkyLjI4MDQ1NyAzNi4wODQ5MDU4IDMzLjk5NDMzNHYzMy45OTQzMzR6IiBmaWxsPSIjZWE4ZDNhIi8+PHBhdGggZD0ibTEyMy4xMTMyMDkgMjI3LjMzNzExNCA0Mi40NTI4MzEgMTAuNjIzMjI5IDEzLjc5NzE3IDQ1LjY3OTg4OC05LjU1MTg4NiA1LjMxMTYxNS00Ni42OTgxMTUtMjcuNjIwMzk4eiIgZmlsbD0iI2Y4OWQzNSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDI2MS4zMzE0NDgtOC40OTA1NjUgNjUuODY0MDI0IDU2LjI1LTM5LjMwNTk0OXoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTc0LjA1NjYwNiAxOTMuMzQyNzggNS4zMDY2MDQgOTAuMjk3NDUxLTE1LjkxOTgxMi00Ni4yMTEwNDl6IiBmaWxsPSIjZWE4ZTNhIi8+PHBhdGggZD0ibTc0LjI5MjQ1MzkgMjYyLjM5Mzc3MSA0OC44MjA3NTUxLTEuMDYyMzIzLTguNDkwNTY1IDY1Ljg2NDAyNHoiIGZpbGw9IiNkODdjMzAiLz48cGF0aCBkPSJtMjQuNDEwMzc3NyAzNTUuODc4MTkzIDkwLjIxMjI2NjMtMjguNjgyNzIxLTQwLjMzMDE5MDEtNjQuODAxNzAxLTczLjIzMTEzMzEzIDUuMzExNjE2eiIgZmlsbD0iI2ViOGYzNSIvPjxwYXRoIGQ9Im0xNjcuNjg4NjgyIDExMC40ODE1ODgtNDUuNjM2NzkzIDM4LjI0MzYyNy0zNS4wMjM1ODU4IDQyLjQ5MjkxOSA4Ny4wMjgzMDI4IDMuMTg2OTY5eiIgZmlsbD0iI2U4ODIxZSIvPjxwYXRoIGQ9Im0xMTQuNjIyNjQ0IDMyNy4xOTU0NzIgNTYuMjUtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIvPjxwYXRoIGQ9Im0yMjkuMjQ1Mjg2IDMyNy4xOTU0NzIgNTUuMTg4NjgtMzkuMzA1OTQ5LTQuMjQ1MjgzIDMzLjk5NDMzNHYxOS4xMjE4MTNsLTM4LjIwNzU0OC03LjQzNjI2eiIgZmlsbD0iI2RmY2VjMyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgNTEzLjY3OTI1MiAwKSIvPjxwYXRoIGQ9Im0xMzIuNjY1MDk2IDIxMi40NjQ1OTMtMTEuNjc0NTI4IDI0LjQzMzQyNyA0MS4zOTE1MS0xMC42MjMyMjl6IiBmaWxsPSIjMzkzOTM5IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAyODMuMzcyNjQ2IDApIi8+PHBhdGggZD0ibTIzLjM0OTA1NyAxLjA2MjMyMjk2IDE0NC4zMzk2MjUgMTA5LjQxOTI2NTA0LTI0LjQxMDM3OC01OS40OTAwODU4eiIgZmlsbD0iI2U4OGYzNSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5Ni0xOS4xMDM3NzM5MiA1OC40Mjc3NjI5NCAxMC42MTMyMDc3MiA2My43MzkzNzgxLTcuNDI5MjQ1NDEgNC4yNDkyOTIgMTAuNjEzMjA3NzEgOS41NjA5MDYtOC40OTA1NjYxNyA3LjQzNjI2MSAxMS42NzQ1Mjg0NyAxMC42MjMyMjktNy40MjkyNDU0IDYuMzczOTM4IDE2Ljk4MTEzMjMgMjEuMjQ2NDU5IDc5LjU5OTA1NzctMjQuNDMzNDI4YzM4LjkxNTA5Ni0zMS4xNjE0NzMgNTguMDE4ODY5LTQ3LjA5NjMxOCA1Ny4zMTEzMjItNDcuODA0NTMzLS43MDc1NDgtLjcwODIxNS00OC44MjA3NTYtMzcuMTgxMzAzNi0xNDQuMzM5NjI1LTEwOS40MTkyNjUwNHoiIGZpbGw9IiM4ZTVhMzAiLz48ZyB0cmFuc2Zvcm09Im1hdHJpeCgtMSAwIDAgMSAzOTkuMDU2NjExIDApIj48cGF0aCBkPSJtMzAuNzc4MzAyMyAxODEuNjU3MjI2LTI5LjcxNjk4MTUzIDg2LjA0ODE2MSA3NC4yOTI0NTM5My00LjI0OTI5M2g0Ny43NTk0MzQzdi0zNy4xODEzMDNsLTIuMTIyNjQxLTc2LjQ4NzI1My0xMC42MTMyMDggOC40OTg1ODN6IiBmaWxsPSIjZjg5ZDM1Ii8+PHBhdGggZD0ibTg3LjAyODMwMzIgMTkxLjIxODEzNCA4Ny4wMjgzMDI4IDIuMTI0NjQ2LTkuNTUxODg2IDQ0LjYxNzU2My00MS4zOTE1MTEtMTAuNjIzMjI5eiIgZmlsbD0iI2Q4N2MzMCIvPjxwYXRoIGQ9Im04Ny4wMjgzMDMyIDE5Mi4yODA0NTcgMzYuMDg0OTA1OCAzMy45OTQzMzR2MzMuOTk0MzM0eiIgZmlsbD0iI2VhOGQzYSIvPjxwYXRoIGQ9Im0xMjMuMTEzMjA5IDIyNy4zMzcxMTQgNDIuNDUyODMxIDEwLjYyMzIyOSAxMy43OTcxNyA0NS42Nzk4ODgtOS41NTE4ODYgNS4zMTE2MTUtNDYuNjk4MTE1LTI3LjYyMDM5OHoiIGZpbGw9IiNmODlkMzUiLz48cGF0aCBkPSJtMTIzLjExMzIwOSAyNjEuMzMxNDQ4LTguNDkwNTY1IDY1Ljg2NDAyNCA1NS4xODg2OC0zOC4yNDM2MjZ6IiBmaWxsPSIjZWI4ZjM1Ii8+PHBhdGggZD0ibTE3NC4wNTY2MDYgMTkzLjM0Mjc4IDUuMzA2NjA0IDkwLjI5NzQ1MS0xNS45MTk4MTItNDYuMjExMDQ5eiIgZmlsbD0iI2VhOGUzYSIvPjxwYXRoIGQ9Im03NC4yOTI0NTM5IDI2Mi4zOTM3NzEgNDguODIwNzU1MS0xLjA2MjMyMy04LjQ5MDU2NSA2NS44NjQwMjR6IiBmaWxsPSIjZDg3YzMwIi8+PHBhdGggZD0ibTI0LjQxMDM3NzcgMzU1Ljg3ODE5MyA5MC4yMTIyNjYzLTI4LjY4MjcyMS00MC4zMzAxOTAxLTY0LjgwMTcwMS03My4yMzExMzMxMyA1LjMxMTYxNnoiIGZpbGw9IiNlYjhmMzUiLz48cGF0aCBkPSJtMTY3LjY4ODY4MiAxMTAuNDgxNTg4LTQ1LjYzNjc5MyAzOC4yNDM2MjctMzUuMDIzNTg1OCA0Mi40OTI5MTkgODcuMDI4MzAyOCAzLjE4Njk2OXoiIGZpbGw9IiNlODgyMWUiLz48cGF0aCBkPSJtMTMyLjY2NTA5NiAyMTIuNDY0NTkzLTExLjY3NDUyOCAyNC40MzM0MjcgNDEuMzkxNTEtMTAuNjIzMjI5eiIgZmlsbD0iIzM5MzkzOSIgdHJhbnNmb3JtPSJtYXRyaXgoLTEgMCAwIDEgMjgzLjM3MjY0NiAwKSIvPjxwYXRoIGQ9Im0yMy4zNDkwNTcgMS4wNjIzMjI5NiAxNDQuMzM5NjI1IDEwOS40MTkyNjUwNC0yNC40MTAzNzgtNTkuNDkwMDg1OHoiIGZpbGw9IiNlODhmMzUiLz48cGF0aCBkPSJtMjMuMzQ5MDU3IDEuMDYyMzIyOTYtMTkuMTAzNzczOTIgNTguNDI3NzYyOTQgMTAuNjEzMjA3NzIgNjMuNzM5Mzc4MS03LjQyOTI0NTQxIDQuMjQ5MjkyIDEwLjYxMzIwNzcxIDkuNTYwOTA2LTguNDkwNTY2MTcgNy40MzYyNjEgMTEuNjc0NTI4NDcgMTAuNjIzMjI5LTcuNDI5MjQ1NCA2LjM3MzkzOCAxNi45ODExMzIzIDIxLjI0NjQ1OSA3OS41OTkwNTc3LTI0LjQzMzQyOGMzOC45MTUwOTYtMzEuMTYxNDczIDU4LjAxODg2OS00Ny4wOTYzMTggNTcuMzExMzIyLTQ3LjgwNDUzMy0uNzA3NTQ4LS43MDgyMTUtNDguODIwNzU2LTM3LjE4MTMwMzYtMTQ0LjMzOTYyNS0xMDkuNDE5MjY1MDR6IiBmaWxsPSIjOGU1YTMwIi8+PC9nPjwvZz48L3N2Zz4=" alt="MetaMask"></div><div class="sc-gsDKAQ gHoDBx web3modal-provider-name">Install MetaMask</div><div class="sc-dkPtRN eCZoDi web3modal-provider-description">Connect using browser wallet</div></a></div>')
        }
    }


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

    //return all resutls from database
    async function getAllWhitelists() {
        const response = await axios.get('https://www2.peoplesnft.io/api/whitelists')
        console.log(response.data)
    }

    //check to see if wallet exists
    async function verifyByWallet(wallet) {
        const response = await axios.get(`https://www2.peoplesnft.io/api/whitelists/check/${wallet}`)
            .then(res => {
                //console.log(res);
                var result = res.data.length;
                console.log(result);
                if(result !== 0) {
                    console.log('we have results')
                } else {
                    console.log('we have no results')
                    addNewWhitelist(wallet);
                }
            })
    }

    //add new whitelist to database
    function addNewWhitelist(walletId) {
        console.log('adding wallet to database '+walletId)
        axios
            .post('https://www2.peoplesnft.io/api/whitelists/add', {
                walletId: walletId,
            })
            .then((response) => {
                setPost(response.data);
                //getAllWhitelists();
                console.log('new whitelist added')
                window.location.reload(false)
            });
    }

    useEffect(() => {
        checkWalletIsConnected();
        //getAllWhitelists();
    }, [])

    return (
        <div id="home">
            <section className="hero-content d-flex min-vh-100" style={{
                    backgroundImage: 'url('+bgImage+')',backgroundPosition: 'center'}}>
                <div className="container align-self-center">
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8 text-center">

                            <h2 className="display">Commemorating ConstitutionDAO</h2>
                            <h1 className="display">The People's NFT</h1>
                            {currentAccount ? <button className="btn btn-light btn-lg">{currentAccount} Is Connected</button> : <button className="btn btn-light btn-lg" onClick={connectWallet}>Get Whitelisted</button>}
                            <p className="mt-5">Presenting NFT collections to drive the spirit forward. Together we will reclaim important cultural artifacts by bringing them under the shared governance of the people. Join us!</p>
                            <p>Brought to you by original ConstitutionDAO moderators and contributors.</p>
                            <p>Stay tuned for the drop info<br/>on our Twitter and Discord</p>
                        </div>
                    </div>
                </div>
            </section>
            {/*<section className="container py-5">*/}
            {/*    <div className="col-md-9">*/}
            {/*        <h2 className="font-large mb-4">Mission</h2>*/}
            {/*        <p className="lead">Our call to action based on Mount Rushmore: Master carver Gutzon Borglum created Mount Rushmore to commemorate America’s first 150 years as a free country.</p>*/}
            {/*    </div>*/}
            {/*</section>*/}
            {/*<section className="quotes">*/}
            {/*    <div className="container-fluid">*/}
            {/*        <div className="row">*/}
            {/*            <div className="col text-white text-center py-5 px-3 bor-right">*/}
            {/*                Commemorate the founding, growth, preservation, and development to the United States of America.*/}
            {/*            </div>*/}
            {/*            <div className="col text-white text-center py-5 px-3 bor-left">*/}
            {/*                Commemorate the founding, growth, preservation, and development to [web3].*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
            {/*<section className="container py-5">*/}
            {/*    <div className="row">*/}
            {/*        <div className="col-lg-7">*/}
            {/*            <h2>Presenting NFT collections to drive the spirit forward.</h2>*/}
            {/*            <p>Together we will reclaim important cultural artifacts by bringing them under the shared governance of the people. Join us!</p>*/}
            {/*            <p>Brought to you by original ConstitutionDAO moderators and contributors.</p>*/}
            {/*        </div>*/}
            {/*        <div className="col-lg-5">*/}
            {/*            <img*/}
            {/*                className="img-fluid rounded mb-4 mb-lg-0"*/}
            {/*                src="https://placehold.it/900x400"*/}
            {/*                alt=""*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
            {/*<section className="join py-5">*/}
            {/*    <div className="container">*/}
            {/*        <div className="row">*/}
            {/*            <div className="col-auto display">Join Our Community</div>*/}
            {/*            <div className="col-auto">*/}
            {/*                <a href="https://twitter.com/peoples_NFT" title="twitter" target="_blank" rel="noreferrer">*/}
            {/*                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#4C9FEC"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>*/}
            {/*                    <strong>Twitter</strong>*/}
            {/*                </a>*/}
            {/*            </div>*/}
            {/*            <div className="col-auto">*/}
            {/*                <a href="https://discord.gg/kpSvvmpDJd" title="discord" target="_blank" rel="noreferrer">*/}
            {/*                    <svg xmlns="http://www.w3.org/2000/svg"  width="50" height="38" viewBox="0 0 25 19.1" fill="#7688D5">*/}
            {/*                        <path d="m21.2 1.6c-1.6-0.7-3.3-1.3-5.1-1.6h-0.1c-0.2 0.4-0.5 0.9-0.6 1.3-1.9-0.3-3.8-0.3-5.7 0-0.2-0.4-0.5-0.8-0.7-1.3h-0.1c-1.7 0.3-3.4 0.8-5.1 1.6-3.2 4.8-4.1 9.6-3.7 14.2v0.1c1.9 1.4 4 2.5 6.2 3.2h0.1c0.5-0.7 0.9-1.3 1.3-2.1v-0.1c-0.7-0.3-1.3-0.6-1.9-0.9v-0.1c0.1-0.1 0.3-0.2 0.4-0.3h0.1c4.1 1.9 8.5 1.9 12.6 0h0.1c0.1 0.1 0.3 0.2 0.4 0.3v0.1c-0.6 0.4-1.3 0.7-2 0.9v0.1c0.4 0.7 0.8 1.4 1.3 2.1h0.1c2.2-0.7 4.4-1.8 6.3-3.2v-0.1c0.3-5.4-1.1-10-3.9-14.2zm-12.8 11.4c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5c1.3 0 2.3 1.1 2.2 2.5 0 1.4-1 2.5-2.2 2.5zm8.3 0c-1.2 0-2.2-1.1-2.2-2.5s1-2.5 2.2-2.5c1.3 0 2.3 1.1 2.2 2.5 0 1.4-1 2.5-2.2 2.5z"/>*/}
            {/*                    </svg>*/}
            {/*                    <strong>Discord</strong>*/}
            {/*                </a>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
            {/*<p id="roadmap" className="pt-5"></p>*/}
            {/*<section className="pb-5">*/}
            {/*    <div className="container">*/}
            {/*        <h2 className="mb-5">Roadmap</h2>*/}
            {/*        <ul className="timeline col-md-9">*/}
            {/*            <li>*/}
            {/*                <img alt="Phase 1: Mint" src="./images/phase1.png" />*/}
            {/*                <p className="phase">Phase 1</p>*/}
            {/*                <p><strong>Mint</strong> an NFT that commemorates the ConstitutionDAO effort & onboards minters to lead the future of the project.</p>*/}
            {/*            </li>*/}
            {/*            <li>*/}
            {/*                <img alt="Phase 2: Vote" src="./images/phase2.png" />*/}
            {/*                <p className="phase">Phase 2</p>*/}
            {/*                <p><strong>Vote</strong> on a historically significant artifact by NFT-holding contributors.</p>*/}
            {/*            </li>*/}
            {/*            <li>*/}
            {/*                <img alt="Phase 3: Purhcase" src="./images/phase3.png" />*/}
            {/*                <p className="phase">Phase 3</p>*/}
            {/*                <p><strong>Purchase</strong> artifacts in the physical world.</p>*/}
            {/*            </li>*/}
            {/*            <li>*/}
            {/*                <img alt="Phase 4: Unveil" src="./images/phase4.png" />*/}
            {/*                <p className="phase">Phase 4</p>*/}
            {/*                <p><strong>Unveil</strong> Web3’s first public exhibit to the world that educates the audience on the artifacts history and about the web3 ecosystem.</p>*/}
            {/*            </li>*/}
            {/*            <li>*/}
            {/*                <img alt="Phase 5: Grow" src="./images/phase5.png" />*/}
            {/*                <p className="phase">Phase 5</p>*/}
            {/*                <p><strong>Grow</strong> the contributor community & acquire more artifacts to expand the educational mission.</p>*/}
            {/*            </li>*/}
            {/*            <li>*/}
            {/*                <img alt="Phase 6: Enable" src="./images/phase6.png" />*/}
            {/*                <p className="phase">Phase 6</p>*/}
            {/*                <p><strong>Enable</strong> priority exhibit access for NFT contributors and host public events to grow community awareness.</p>*/}
            {/*            </li>*/}
            {/*        </ul>*/}
            {/*    </div>*/}
            {/*</section>*/}
        </div>

    );
}

export default Home;
