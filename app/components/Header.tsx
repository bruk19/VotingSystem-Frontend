// "use client"
// import { useEffect, useState } from "react";

// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// interface HeaderProps {}

// const Header: React.FC<HeaderProps> = () => {
//   const [account, setAccount] = useState<string | null>(null);
//   const [isWeb3EnableLoading, setIsWeb3EnableLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const handleAccountsChanged = (accounts: string[]) => {
//       if (accounts.length === 0) {
//         window.localStorage.removeItem('connected');
//         console.log('Null account found');
//       } else {
//         setAccount(accounts[0]);
//       }
//     };

//     const getConnectedAccount = async () => {
//       if (window.ethereum) {
//         try {
//           const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//           if (accounts.length > 0) {
//             setAccount(accounts[0]);
//           }
//         } catch (error) {
//           console.error('Error getting connected account:', error);
//         }
//       }
//     };

//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', handleAccountsChanged);
//       getConnectedAccount();
//     }

//     return () => {
//       if (window.ethereum) {
//         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
//       }
//     };
//   }, []);

//   const enableWeb3 = async () => {
//     setIsWeb3EnableLoading(true);
//     try {
//       if (window.ethereum) {
//         await window.ethereum.request({ method: 'eth_requestAccounts' });
//         const accounts = await window.ethereum.request({ method: 'eth_accounts' });
//         setAccount(accounts[0]);
//         if (typeof window !== 'undefined') {
//           window.localStorage.setItem('connected', 'inject');
//         }
//       } else {
//         console.error('MetaMask is not detected.');
//       }
//     } catch (error) {
//       console.error('Error connecting wallet:', error);
//     } finally {
//       setIsWeb3EnableLoading(false);
//     }
//   };

//   return (
//     <div>
//       {account ? (
//         <p className="text-lg font-bold mb-4">
//           Account: {account.slice(0, 4)}...{account.slice(-4)}
//         </p>
//       ) : (
//         <button
//           onClick={async () => {
//             await enableWeb3();
//             if (typeof window !== "undefined") {
//               window.localStorage.setItem("connected", "inject");
//             }
//           }}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Connect Wallet
//         </button>
//       )}
//     </div>
//   );
// };

// export default Header;
